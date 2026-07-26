import re

with open('phone-store-openapi.yaml', 'r', encoding='utf-8') as f:
    text = f.read()

dups = [
    '/api/v1/warehouses/{id}',
    '/api/v1/suppliers/{id}',
    '/api/v1/orders/{orderCode}/return-requests',
    '/api/v1/admin/refunds'
]

for dup in dups:
    pattern = r'\n  ' + re.escape(dup) + r':\n'
    parts = re.split(pattern, text)
    if len(parts) == 3:
        top = parts[0]
        middle = parts[1]
        bottom = parts[2]
        
        # Bottom block goes from start of bottom up to the next route or end of components
        next_route_match = re.search(r'\n  /[a-zA-Z]', bottom)
        if next_route_match:
            end_idx = next_route_match.start()
            bottom_block = bottom[:end_idx]
            rest_bottom = bottom[end_idx:]
        else:
            comp_match = re.search(r'\ncomponents:', bottom)
            if comp_match:
                end_idx = comp_match.start()
                bottom_block = bottom[:end_idx]
                rest_bottom = bottom[end_idx:]
            else:
                bottom_block = bottom
                rest_bottom = ''
                
        # Merge bottom_block into the first occurrence
        text = top + '\n  ' + dup + ':\n' + bottom_block.strip('\n') + '\n' + middle + rest_bottom

with open('phone-store-openapi.yaml', 'w', encoding='utf-8') as f:
    f.write(text)

print("Merged perfectly via Python!")
