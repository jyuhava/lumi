import os
import re

vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'
files = [f for f in os.listdir(vue_dir) if f.endswith('.vue')]

for f in files:
    path = os.path.join(vue_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Replace any remaining onChange={(e) => setX(...)} with @change="x = ..." or just v-model="x"
    # Actually, simpler: search for onChange={.*?set([A-Z]\w*)\(.*?\} and replace with v-model! 
    # But wait, v-model handles numbers nicely with type="number"
    def repl_onchange(m):
        setter = m.group(1)
        var_name = setter[0].lower() + setter[1:]
        return f'v-model="{var_name}"'
        
    content = re.sub(r'onChange=\{.*?set([A-Z]\w*)\(.*?\)\s*\}', repl_onchange, content, flags=re.DOTALL)
    
    # Fix option value={...} -> :value="..."
    content = re.sub(r'value=\{([^}]+)\}', r':value="\1"', content)
    
    # Fix className={...}
    content = re.sub(r'className=\{`([^`]+)`\}', r':class="`\1`"', content)
    
    # Check for variables in text {var}
    # It might have been converted to {{ var }} already by the previous pass, but let's make sure there are no naked {...} expressions in the template.
    # Actually, the last pass left `{hasil.bbiAmputasi.toFixed(1)}` as `{{ hasil.bbiAmputasi.toFixed(1) }}` which is correct.
    
    # If there are still {cond && ( ... )} we should just strip them because it's v-if.
    content = re.sub(r'\{([a-zA-Z0-9_\.\s!==<>\']+?)&&\s*\((.*?)\)\s*\}', r'<template v-if="\1">\2</template>', content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
print("Fixes applied.")
