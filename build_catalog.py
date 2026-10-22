"""Refresh a standalone public catalogue from the local desktop catalogue.
Only explicitly selected public product fields are exported, never CRM tables.
"""
from pathlib import Path
import sqlite3,json,hashlib,os
from PIL import Image,ImageOps
HERE=Path(__file__).resolve().parent
APP=HERE.parent/'софт'
ASSETS=HERE/'assets';ASSETS.mkdir(exist_ok=True)
translations=json.loads((APP/'import_data/catalog_uz.json').read_text(encoding='utf8'))
connection=sqlite3.connect((APP/'data/catalog.sqlite3').resolve().as_uri()+'?mode=ro',uri=True)
connection.row_factory=sqlite3.Row

def photo(value):
    if not value:return ''
    source=Path(value)
    if not source.is_absolute():
        source=APP/source if (APP/source).is_file() else HERE.parent/source
    if not source.is_file():return ''
    stat=source.stat();key=hashlib.sha256(f'{source}|{stat.st_mtime_ns}|{stat.st_size}'.encode()).hexdigest()[:24]
    for suffix,size in (('',(1600,1000)),('-thumb',(480,300))):
        target=ASSETS/(key+suffix+'.jpg')
        if target.exists():continue
        with Image.open(source) as image:
            image=ImageOps.exif_transpose(image);image.thumbnail(size,Image.Resampling.LANCZOS)
            rgba=image.convert('RGBA');white=Image.new('RGB',image.size,'white');white.paste(rgba,mask=rgba.getchannel('A'))
            temporary=target.with_suffix('.tmp');white.save(temporary,'JPEG',quality=94 if not suffix else 90,subsampling=0,optimize=True);os.replace(temporary,target)
    return 'assets/'+key

products=[]
for row in connection.execute('SELECT id,name,description,direction,category,unit,price,image_path FROM products WHERE deleted=0 ORDER BY name'):
    p={k:row[k] for k in ('id','name','description','direction','category','unit','price')}
    p['image']=photo(row['image_path']);p['uz']={k:translations.get(row[k],row[k]) for k in ('name','description','direction','category','unit')}
    products.append(p)
connection.close()
payload={'products':products,'company':'ELXOLDING SMART CATALOG'}
temporary=HERE/'catalog-data.tmp';temporary.write_text('window.CATALOG='+json.dumps(payload,ensure_ascii=False).replace('</','<\\/')+';',encoding='utf8');os.replace(temporary,HERE/'catalog-data.js')
print(f'Public catalogue ready: {len(products)} products. No clients, orders, payments or documents exported.')
