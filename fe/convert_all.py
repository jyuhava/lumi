import os
import re

react_dir = '/Users/wiibs/project/nut/ref/src/components/calculators'
vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'

os.makedirs(vue_dir, exist_ok=True)

files_to_convert = [
    'AmputasiCalculator.tsx',
    'BBKCalculator.tsx',
    'BumilBusuiCalculator.tsx',
    'CarboCountingCalculator.tsx',
    'EstimasiAntropometri.tsx',
    'FungsiGinjal.tsx',
    'GCSCalculator.tsx',
    'GiziAnakCalculator.tsx',
    'GiziKlinisCalculator.tsx',
    'LabGiziCalculator.tsx',
    'PenurunanBBCalculator.tsx',
    'PreskripsiDietCalculator.tsx',
    'StatusGizi.tsx',
    'TinggiLututCalculator.tsx',
    'ZScoreCalculator.tsx'
]

for filename in files_to_convert:
    with open(os.path.join(react_dir, filename), 'r', encoding='utf-8') as f:
        content = f.read()

    # Generic search for component body and return JSX
    comp_match = re.search(r"export default function \w+\(\)\s*\{(.*?)return\s*\(\s*(<div.*)\s*\);\s*\}", content, re.DOTALL)
    if not comp_match:
        if "return" in content:
            print(f"Failed to match component in {filename}")
        continue
        
    js_logic = comp_match.group(1)
    jsx_template = comp_match.group(2)

    # Convert useState to refs
    states = re.findall(r"const\s+\[(\w+),\s*set([A-Z]\w*)\]\s*=\s*useState(?:<([^>]+)>)?\((.*?)\);", content)
    
    vue_refs = []
    vue_imports = set(['ref', 'computed'])
    for state_var, setter, state_type, initial in states:
        if state_type:
            vue_refs.append(f"const {state_var} = ref<{state_type}>({initial})")
        else:
            vue_refs.append(f"const {state_var} = ref({initial})")
            
        # Remove from js_logic
        js_logic = re.sub(r"const\s+\[" + state_var + r",\s*set" + setter + r"\]\s*=\s*useState.*?;", "", js_logic)
        
        # Replace occurrences of state_var with state_var.value, except when followed by : (in object keys) or in strings (heuristic: not super robust but works for these calculators)
        # Using negative lookahead to ignore if part of an object literal key like `{ bb: bb }` -> avoid converting key
        js_logic = re.sub(r'\b' + state_var + r'\b(?!\s*:)', state_var + '.value', js_logic)

    # Any custom types and interfaces
    types_match = re.findall(r"(type|interface)\s+(\w+).*?;", content, re.DOTALL)
    types_blocks = []
    # simplistic approach: assume types are at file level
    for t_type, t_name in types_match:
        t_block = re.search(fr"{t_type}\s+{t_name}[^;]+;", content, re.DOTALL)
        if t_block:
            types_blocks.append(t_block.group(0))

    # Translate JSX to Template
    template = jsx_template
    template = template.replace('className="', 'class="')
    template = template.replace('htmlFor="', 'for="')
    
    for state_var, setter, _, _ in states:
        full_setter = "set" + setter
        # Try to map onChange
        # e.target.value as type
        template = re.sub(r'onChange=\{\(e\)\s*=>\s*' + full_setter + r'\(e\.target\.value[^)]*\)\}', f'v-model="{state_var}"', template)
        # generic e.target.value
        template = re.sub(r'onChange=\{\([^\)]*\)\s*=>\s*' + full_setter + r'\([^\)]*\.target\.value.*?\)\}', f'v-model="{state_var}"', template)
        # direct map
        template = re.sub(r'onChange=\{\(\)\s*=>\s*' + full_setter + r'\((.*?)\)\}', f'@change="{state_var} = \\1"', template)
        template = re.sub(r'onClick=\{\(\)\s*=>\s*' + full_setter + r'\((.*?)\)\}', f'@click="{state_var} = \\1"', template)

    # Some variables inside curly inside JSX
    # {var} -> {{ var }} 
    # But ONLY outside of tags
    # It's hard to distinguish.
    # What I'll do:
    # 1. Strip `value={var}` entirely if we just added `v-model`. 
    # Actually just replace value={var} with :value="var" if it's there. But v-model complains if there is value.
    for state_var, _, _, _ in states:
        template = re.sub(r'value=\{(' + state_var + r')\}', '', template)

    # Change remaining {var} to {{ var }} (Very naïve, might break some bindings)
    # Convert { x ? y : z } inside classes to :class="x ? 'y' : 'z'"
    template = re.sub(r'class=`(.*?)`', r':class="`\1`"', template)
    template = template.replace('checked={', ':checked="').replace('disabled={', ':disabled="')

    vue_filename = filename.replace('.tsx', '.vue')
    
    vue_file_content = f"""<template>
  <div class="h-full bg-white">
    {template[template.find(">")+1:template.rfind("</div>")]}
  </div>
</template>

<script setup lang="ts">
{'import { ref, computed } from "vue"'}
{chr(10).join(types_blocks)}

{chr(10).join(vue_refs)}

{js_logic.strip()}
</script>
"""

    with open(os.path.join(vue_dir, vue_filename), 'w', encoding='utf-8') as out_f:
        out_f.write(vue_file_content)

print("Conversion complete!")
