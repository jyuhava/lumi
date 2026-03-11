import os
import re

vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'
files = [f for f in os.listdir(vue_dir) if f.endswith('.vue')]

for f in files:
    path = os.path.join(vue_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Fix the missing brace to template tag error: {something.toFixed(X</template>  => {{ something.toFixed(X) }}
    content = re.sub(r'\{([^{}]+?\.toFixed\(\d+)</template>', r'{{ \1) }}', content)
    
    # Also check if there are other {var</template>
    content = re.sub(r'\{([a-zA-Z0-9_\.\[\]\(\)]+)</template>', r'{{ \1 }}', content)
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

