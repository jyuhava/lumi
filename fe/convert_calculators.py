import os
import re

react_dir = '/Users/wiibs/project/nut/ref/src/components/calculators'
vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'

os.makedirs(vue_dir, exist_ok=True)

html_replacements = [
    ('className=', 'class='),
    ('htmlFor=', 'for='),
    ('onClick=', '@click='),
    ('onChange=', '@change='),
]

# We will just write a base wrapper for CalculatorV1View that imports what we manually convert.
# Automatic converter is too complex for React -> Vue (hooks -> refs).

