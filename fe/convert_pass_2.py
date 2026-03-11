import os
import re

react_dir = '/Users/wiibs/project/nut/ref/src/components/calculators'
vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'

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

def map_vue_template(html):
    # Fix disabled={...}
    html = re.sub(r'disabled=\{(.*?)\}', r':disabled="\1"', html)
    html = re.sub(r'checked=\{(.*?)\}', r':checked="\1"', html)
    html = re.sub(r'className="', 'class="', html)
    html = re.sub(r'htmlFor="', 'for="', html)
    
    # Conditional Rendering: { cond && ( ... ) }
    # This is tricky because the element inside can span multiple lines.
    # We will just replace `{cond && (` with `<template v-if="cond">` and `)}` with `</template>`
    # Regex approach for conditional blocks
    def repl_cond(m):
        cond = m.group(1).strip()
        inner = m.group(2)
        # remove outer parens if there
        if inner.startswith('(') and inner.endswith(')'):
            inner = inner[1:-1]
        return f'<template v-if="{cond}">{inner}</template>'

    # loop to catch nested
    old_html = ""
    while old_html != html:
        old_html = html
        html = re.sub(r'\{([^{}]+?)&&\s*\((.*?)\)\s*\}', repl_cond, html, flags=re.DOTALL)
        # Also map single line `{cond && <div...>...</div>}`
        html = re.sub(r'\{([^{}]+?)&&\s*(<[^>]+?>.*?<\/[^>]+?>)\s*\}', repl_cond, html, flags=re.DOTALL)
        
    # Ternary { cond ? ( ... ) : ( ... ) }
    def repl_ternary(m):
        cond = m.group(1).strip()
        true_b = m.group(2).strip()
        false_b = m.group(3).strip()
        if true_b.startswith('('): true_b = true_b[1:-1]
        if false_b.startswith('('): false_b = false_b[1:-1]
        return f'<template v-if="{cond}">{true_b}</template><template v-else>{false_b}</template>'

    html = re.sub(r'\{([^{}]+?)\?\s*\((.*?)\)\s*:\s*\((.*?)\)\s*\}', repl_ternary, html, flags=re.DOTALL)

    # Some variables like {hasil.bbiAmputasi.toFixed(1)}
    # Convert { var } to {{ var }} as long as they aren't inside attributes
    html = re.sub(r'(?<!=)\{([^{}]+?)\}', r'{{ \1 }}', html)
    
    # Fix the cases where class={xxx}
    html = re.sub(r'class=\{\`(.*?)\`\}', r':class="`\1`"', html)
    
    return html

for filename in files_to_convert:
    with open(os.path.join(react_dir, filename), 'r', encoding='utf-8') as f:
        content = f.read()

    comp_match = re.search(r"export default function \w+\(\)\s*\{(.*?)return\s*\(\s*(<div.*)\s*\);\s*\}", content, re.DOTALL)
    if not comp_match:
        continue
        
    js_logic = comp_match.group(1)
    jsx_template = comp_match.group(2)

    states = re.findall(r"const\s+\[(\w+),\s*set([A-Z]\w*)\]\s*=\s*useState(?:<([^>]+)>)?\((.*?)\);", content)
    
    vue_refs = []
    
    # Extract types to put in <script>
    types_match = re.findall(r"(?:type|interface)\s+(\w+).*?;", content, re.DOTALL)
    types_blocks = []
    for t_name in types_match:
        t_block = re.search(fr"(?:type|interface)\s+{t_name}[^;]+;", content, re.DOTALL)
        if t_block:
            types_blocks.append(t_block.group(0))

    for state_var, setter, state_type, initial in states:
        if state_type:
            vue_refs.append(f"const {state_var} = ref<{state_type}>({initial})")
        else:
            vue_refs.append(f"const {state_var} = ref({initial})")
            
        js_logic = re.sub(r"const\s+\[" + state_var + r",\s*set" + setter + r"\]\s*=\s*useState.*?;", "", js_logic)
        js_logic = re.sub(r'\b' + state_var + r'\b(?!\s*:)', state_var + '.value', js_logic)

    template = map_vue_template(jsx_template)
    
    # Fix onChange / onClick
    for state_var, setter, _, _ in states:
        full_setter = "set" + setter
        template = re.sub(r'onChange=\{\(e\)\s*=>\s*' + full_setter + r'\(e\.target\.value.*?\)\}', f'v-model="{state_var}"', template)
        template = re.sub(r'onChange=\{\(e\)\s*=>\s*' + full_setter + r'\([^\)]*\)\}', f'v-model="{state_var}"', template)
        template = re.sub(r'onChange=\{\(\)\s*=>\s*' + full_setter + r'\((.*?)\)\}', f'@change="{state_var} = \\1"', template)
        template = re.sub(r'onClick=\{\(\)\s*=>\s*' + full_setter + r'\((.*?)\)\}', f'@click="{state_var} = \\1"', template)
        template = re.sub(r'value=\{(' + state_var + r')\}', '', template)

    # Some variables inside script need computed if they rely on refs
    # E.g. const bbiAnak = hitungBBIAnak(); -> const bbiAnak = computed(() => hitungBBIAnak())
    # We will just declare all regular variables that are assigned the result of a function or calculation as computed
    js_logic = re.sub(r"const (\w+)\s*=\s*hitung[A-Za-z0-9_]*\(\);", r"const \1 = computed(() => \g<0>[:-1]);", js_logic) # rough but let's replace nicely
    js_logic_lines = js_logic.split('\n')
    new_js = []
    for line in js_logic_lines:
        match = re.search(r'const\s+(\w+)\s*=\s*([a-zA-Z0-9_]+)\(\);', line)
        if match:
            new_js.append(f"const {match.group(1)} = computed(() => {match.group(2)}())")
        else:
            new_js.append(line)
    js_logic = "\n".join(new_js)

    vue_filename = filename.replace('.tsx', '.vue')
    
    vue_file_content = f"""<template>
  <div class="h-full bg-white">
    {template[template.find(">")+1:template.rfind("</div>")]}
  </div>
</template>

<script setup lang="ts">
import {{ ref, computed }} from 'vue'
{chr(10).join(types_blocks)}

{chr(10).join(vue_refs)}

{js_logic.strip()}
</script>
"""

    with open(os.path.join(vue_dir, vue_filename), 'w', encoding='utf-8') as out_f:
        out_f.write(vue_file_content)

print("Second pass conversion complete!")
