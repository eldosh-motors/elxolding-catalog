import os
import json

root_dir = os.path.dirname(os.path.abspath(__file__))
certs_assets_dir = os.path.join(root_dir, 'assets', 'certificates')
os.makedirs(certs_assets_dir, exist_ok=True)

valid_exts = ('.jpg', '.jpeg', '.png', '.webp')

files = []
for f in sorted(os.listdir(certs_assets_dir)):
    ext = os.path.splitext(f)[1].lower()
    if ext in valid_exts and f != 'certificates-all.png':
        name_no_ext = os.path.splitext(f)[0].replace('_', ' ').replace('-', ' ')
        files.append({
            "file": f"assets/certificates/{f}",
            "title": name_no_ext.title()
        })

json_path = os.path.join(certs_assets_dir, 'certificates-list.json')
with open(json_path, 'w', encoding='utf-8') as jf:
    json.dump(files, jf, ensure_ascii=False, indent=2)

print(f"Всего найдено и подключено сертификатов: {len(files)}")
