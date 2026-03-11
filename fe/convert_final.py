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
    
    # Simple replace of `onChange={(e) => setX(e.target.value)}` with `v-model="x"`
    # This will be done in the main loop more accurately with states.
    
    # Conditional Rendering: { cond && ( ... ) }
    # Instead of regex, we can just replace `{cond && (` with `<template v-if="cond">` and `)}` with `</template>` if we are careful.
    # Actually regex can work if it only matches within the outer bounds.
    def repl_cond(m):
        cond = m.group(1).strip()
        inner = m.group(2)
        if inner.startswith('(') and inner.endswith(')'):
            inner = inner[1:-1]
        return f'<template v-if="{cond}">{inner}</template>'

    # It's better to do recursive replacement or replace the `{cond && (` as `<template v-if="cond">` and handle `)}`
    # Let's just do it simply:
    # `{\s*([^}]+?)\s*&&\s*\(` -> `<template v-if="\1">`
    # `\s*\)\s*\}` -> `</template>` (We have to be careful not to replace all `)}`)
    
    # Let's try matching exactly `{ A && ( B ) }` where B doesn't contain `{` or `}`? No, B does contain them.
    # Let's use simple string replacements for the specific patterns we know exist in these files:
    
    html = re.sub(r'\{([a-zA-Z0-9_\.\s!==<>\'\"]+?)&&\s*\(', r'<template v-if="\1">', html)
    # The closing `)}` that are on their own line:
    html = re.sub(r'^\s*\)\}\s*$', '</template>', html, flags=re.MULTILINE)
    
    # {cond && <div...</div>}
    html = re.sub(r'\{([a-zA-Z0-9_\.\s!==<>\'\"]+?)&&\s*(<[^>]+?>.*?<\/[^>]+?>)\s*\}', r'<template v-if="\1">\2</template>', html, flags=re.DOTALL)
    
    # Ternary { cond ? ( ... ) : ( ... ) }
    # Since these exist, let's just do a greedy match on them specifically
    # E.g. {tab === 'bb' ? ( <div...></div> ) : ( <div...></div> )}
    html = re.sub(r'\{([^{}]+?)\?\s*\((.*?)\)\s*:\s*\((.*?)\)\s*\}', r'<template v-if="\1">\2</template><template v-else>\3</template>', html, flags=re.DOTALL)

    # Some variables like {hasil.bbiAmputasi.toFixed(1)}
    # Convert { var } to {{ var }} as long as they aren't inside attributes
    html = re.sub(r'(?<![:=])\{([a-zA-Z0-9_\.\[\]\(\)\+\-\*\/\?\s\':]+)\}(?!})', r'{{ \1 }}', html)
    
    # Fix the cases where class={`xxx`}
    html = re.sub(r'class=\{\`([^`]+)`\}', r':class="`\1`"', html)
    
    # Fix onChange / onClick etc
    html = re.sub(r'onChange=\{.*?set([A-Z]\w*)\(.*?\)\s*\}', lambda m: f'v-model="{m.group(1)[0].lower() + m.group(1)[1:]}"', html, flags=re.DOTALL)
    html = re.sub(r'onClick=\{.*?set([A-Z]\w*)\((.*?)\)\s*\}', lambda m: f'@click="{m.group(1)[0].lower() + m.group(1)[1:]} = {m.group(2)}"', html, flags=re.DOTALL)
    
    # Fix value={...} which was removed but we need it for options or inputs if v-model isn't enough, but v-model overrides it.
    html = re.sub(r'value=\{([^}]+)\}', r':value="\1"', html)

    # Re-fix `v-model` combined with `:value`
    html = re.sub(r':value="[^"]+"\s+v-model', 'v-model', html)
    html = re.sub(r'v-model="([^"]+)"\s+:value="[^"]+"', r'v-model="\1"', html)
    
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

    initial_js_logic = js_logic
    for state_var, setter, state_type, initial in states:
        if state_type:
            vue_refs.append(f"const {state_var} = ref<{state_type}>({initial})")
        else:
            vue_refs.append(f"const {state_var} = ref({initial})")
            
        js_logic = re.sub(r"const\s+\[" + state_var + r",\s*set" + setter + r"\]\s*=\s*useState.*?;", "", js_logic)
        js_logic = re.sub(r'\b' + state_var + r'\b(?!\s*:)', state_var + '.value', js_logic)

    template = map_vue_template(jsx_template)
    
    # Computed props
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

print("Final conversion complete!")
