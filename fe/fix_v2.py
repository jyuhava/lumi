import os
import re

vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'
files = [f for f in os.listdir(vue_dir) if f.endswith('.vue')]

for f in files:
    path = os.path.join(vue_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Remove hanging )}
    content = re.sub(r'^\s*\)\}\s*$', '', content, flags=re.MULTILINE)
    content = content.replace(')}', '')
    
    # Fix broken `<template>` insertions like {gfr.toFixed(2</template>
    content = content.replace('</template>', '')
    content = content.replace('<template v-if=', '\n<template v-if=')
    # Actually wait. The <template> logic from `convert_pass_2.py` broke things really badly.
    # It replaced `}` with `</template>` if it matched a condition, which failed.
