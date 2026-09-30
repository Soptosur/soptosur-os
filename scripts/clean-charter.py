import re

with open('lib/official-charter.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any \" that appears right before a comma or newline where it should just be "
fixed = re.sub(r'\\\"(\s*[,\]\n\r])', r'"\1', text)

with open('lib/official-charter.ts', 'w', encoding='utf-8') as f:
    f.write(fixed)

print('Done cleaning official-charter.ts')
