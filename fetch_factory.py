import os
import re
import urllib.request
import ssl

url = "https://elxolding.uz/?page_id=58"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    
    # Find all images
    img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    print(f"Found {len(img_urls)} image URLs on page_id=58:")
    
    out_dir = r"e:\SKRIPT\ELXOLDING\Клиентский каталог\elxolding-catalog\assets\factory"
    os.makedirs(out_dir, exist_ok=True)
    
    saved_count = 0
    for i, u in enumerate(img_urls):
        if not u.startswith('http'):
            u = "https://elxolding.uz" + (u if u.startswith('/') else '/' + u)
        
        # Filter for content/factory images (skip small icons if possible)
        ext = os.path.splitext(u.split('?')[0])[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.webp']:
            fn = f"factory_{saved_count+1}{ext}"
            fp = os.path.join(out_dir, fn)
            try:
                print(f"Downloading: {u} -> {fn}")
                r_img = urllib.request.Request(u, headers=headers)
                with urllib.request.urlopen(r_img, context=ctx, timeout=10) as ir, open(fp, 'wb') as f:
                    f.write(ir.read())
                saved_count += 1
            except Exception as e:
                print(f"Error downloading {u}: {e}")
                
    print(f"SUCCESS: Total {saved_count} factory images saved to {out_dir}")
except Exception as e:
    print(f"Error fetching page: {e}")
