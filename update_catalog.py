"""
Скрипт автоматического обновления каталога ELXOLDING из Excel/PDF/CSV.
Положите ваш файл Excel (.xlsx, .xls), CSV (.csv) или PDF с прайс-листом в папку:
  update_data/
Затем дважды кликните по "ОБНОВИТЬ_КАТАЛОГ.bat".
Скрипт сопоставит товары по артикулу (id) или наименованию (name) и обновит цены/названия в catalog-data.js.
"""

import os
import sys
import json
import re
import glob

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, 'update_data')
CATALOG_JS_PATH = os.path.join(BASE_DIR, 'catalog-data.js')

def ensure_input_dir():
    if not os.path.exists(INPUT_DIR):
        os.makedirs(INPUT_DIR)
        print(f"[+] Создана папка: {INPUT_DIR}")
        readme_path = os.path.join(INPUT_DIR, 'ИНСТРУКЦИЯ.txt')
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(
                "Положите в эту папку ваш свежий файл с ценами и товарами:\n"
                "1. Excel файл (.xlsx или .xls)\n"
                "2. Или CSV файл (.csv)\n"
                "3. Или PDF файл с прайс-листом\n\n"
                "Файл Excel должен содержать колонки:\n"
                "- Артикул (или Код, ID)\n"
                "- Наименование (или Название, Товар)\n"
                "- Цена (или Цена с НДС, Стоимость)\n"
                "- Ед. изм. (необязательно)\n\n"
                "После того как положили файл, запустите файл 'ОБНОВИТЬ_КАТАЛОГ.bat' в основной папке.\n"
            )

def load_current_catalog():
    if not os.path.exists(CATALOG_JS_PATH):
        print(f"[!] Ошибка: Не найден файл {CATALOG_JS_PATH}")
        sys.exit(1)
    
    with open(CATALOG_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    prefix = "window.CATALOG="
    if content.startswith(prefix):
        json_str = content[len(prefix):].rstrip(';')
    else:
        # Поиск по шаблону
        m = re.search(r'window\.CATALOG\s*=\s*(\{.*?\});?$', content, re.DOTALL)
        if m:
            json_str = m.group(1)
        else:
            print("[!] Не удалось распознать формат window.CATALOG в catalog-data.js")
            sys.exit(1)
            
    try:
        data = json.loads(json_str)
        return data
    except Exception as e:
        print(f"[!] Ошибка парсинга JSON из catalog-data.js: {e}")
        sys.exit(1)

def save_catalog(data):
    # Создаем резервную копию перед сохранением
    backup_path = os.path.join(BASE_DIR, 'catalog-data.backup.js')
    if os.path.exists(CATALOG_JS_PATH):
        try:
            with open(CATALOG_JS_PATH, 'r', encoding='utf-8') as src:
                with open(backup_path, 'w', encoding='utf-8') as dst:
                    dst.write(src.read())
            print(f"[+] Создана резервная копия: catalog-data.backup.js")
        except Exception as e:
            print(f"[!] Предупреждение: Не удалось создать бэкап: {e}")
            
    with open(CATALOG_JS_PATH, 'w', encoding='utf-8') as f:
        f.write("window.CATALOG=")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")
    print(f"[✔] Файл {CATALOG_JS_PATH} успешно обновлен!")

def clean_price(val):
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    # Удаляем пробелы, валюты 'сум', 'UZS', 'руб'
    s = re.sub(r'[^\d.,]', '', s)
    if not s:
        return None
    # Заменяем запятую на точку, если она десятичная
    if ',' in s and '.' in s:
        s = s.replace(',', '')
    elif ',' in s:
        s = s.replace(',', '.')
    try:
        return float(s)
    except:
        return None

def parse_excel(filepath):
    """Парсинг Excel через openpyxl или xlrd"""
    rows = []
    ext = os.path.splitext(filepath)[1].lower()
    
    if ext == '.xlsx':
        try:
            import openpyxl
            wb = openpyxl.load_workbook(filepath, data_only=True)
            for sheet in wb.worksheets:
                for row in sheet.iter_rows(values_only=True):
                    if any(cell is not None for cell in row):
                        rows.append(list(row))
        except ImportError:
            print("[!] Для чтения .xlsx требуется openpyxl. Попробуем установить или используйте CSV.")
            return []
    elif ext == '.xls':
        try:
            import xlrd
            wb = xlrd.open_workbook(filepath)
            for sheet in wb.sheets():
                for r in range(sheet.nrows):
                    rows.append(sheet.row_values(r))
        except ImportError:
            print("[!] Для чтения .xls требуется библиотека xlrd.")
            return []
    return rows

def parse_csv(filepath):
    import csv
    rows = []
    # Попробуем автоопределить разделитель
    for enc in ['utf-8', 'cp1251', 'windows-1251']:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                sample = f.read(4096)
                dialect = csv.Sniffer().sniff(sample, delimiters=',;\t')
                f.seek(0)
                reader = csv.reader(f, dialect)
                for r in reader:
                    rows.append(r)
            break
        except Exception:
            continue
    return rows

def parse_pdf(filepath):
    """Попытка извлечь таблицы из PDF"""
    rows = []
    try:
        import pypdf
        reader = pypdf.PdfReader(filepath)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                for line in text.split('\n'):
                    parts = re.split(r'\t+|\s{2,}', line.strip())
                    if len(parts) >= 2:
                        rows.append(parts)
    except Exception as e:
        print(f"[!] Не удалось прочитать PDF (библиотека pypdf): {e}")
    return rows

def process_updates():
    ensure_input_dir()
    
    supported_files = glob.glob(os.path.join(INPUT_DIR, '*.xlsx')) + \
                      glob.glob(os.path.join(INPUT_DIR, '*.xls')) + \
                      glob.glob(os.path.join(INPUT_DIR, '*.csv')) + \
                      glob.glob(os.path.join(INPUT_DIR, '*.pdf'))
                      
    if not supported_files:
        print("\n=======================================================")
        print("[!] В папке 'update_data' не обнаружено файлов Excel, CSV или PDF!")
        print("Положите файл с ценами в папку: update_data/")
        print("=======================================================\n")
        return
        
    print(f"\n[+] Найдено файлов для обновления: {len(supported_files)}")
    catalog_data = load_current_catalog()
    products = catalog_data.get('products', [])
    
    # Индексируем существующие товары
    by_id = {str(p.get('id', '')).strip().lower(): p for p in products if p.get('id')}
    by_name = {str(p.get('name', '')).strip().lower(): p for p in products if p.get('name')}
    
    updated_count = 0
    new_products_count = 0
    
    for filepath in supported_files:
        filename = os.path.basename(filepath)
        print(f"\n[-] Обработка файла: {filename}...")
        ext = os.path.splitext(filepath)[1].lower()
        
        rows = []
        if ext in ['.xlsx', '.xls']:
            rows = parse_excel(filepath)
        elif ext == '.csv':
            rows = parse_csv(filepath)
        elif ext == '.pdf':
            rows = parse_pdf(filepath)
            
        if not rows:
            print(f"[!] Файл {filename} пуст или не удалось прочитать строки.")
            continue
            
        print(f"[+] Прочитано строк: {len(rows)}")
        
        # Определяем индексы колонок (id, name, price, unit)
        id_col = None
        name_col = None
        price_col = None
        unit_col = None
        header_idx = -1
        
        for idx, row in enumerate(rows[:15]):
            str_cells = [str(c or '').strip().lower() for c in row]
            for c_idx, cell in enumerate(str_cells):
                if id_col is None and any(w in cell for w in ['артикул', 'код', 'artikul', 'id', '№']):
                    id_col = c_idx
                elif name_col is None and any(w in cell for w in ['наименование', 'название', 'товар', 'nomi', 'product']):
                    name_col = c_idx
                elif price_col is None and any(w in cell for w in ['цена', 'стоимость', 'narx', 'summa', 'ндс']):
                    price_col = c_idx
                elif unit_col is None and any(w in cell for w in ['ед.', 'изм', 'birlik', 'unit']):
                    unit_col = c_idx
                    
            if (id_col is not None or name_col is not None) and price_col is not None:
                header_idx = idx
                break
                
        # Если заголовки не распознаны по ключевым словам, пробуем эвристику:
        if header_idx == -1:
            # Ищем первую строку с 3+ колонками
            for idx, r in enumerate(rows):
                if len(r) >= 3:
                    header_idx = idx - 1
                    id_col = 0
                    name_col = 1
                    price_col = 2
                    break
                    
        print(f"[i] Колонки: ID={id_col}, Название={name_col}, Цена={price_col}, Ед.изм={unit_col}")
        
        data_rows = rows[header_idx + 1:] if header_idx >= 0 else rows
        file_updated = 0
        
        for r in data_rows:
            if not r or len(r) <= max(c for c in [id_col, name_col, price_col] if c is not None):
                continue
                
            row_id = str(r[id_col]).strip() if id_col is not None and id_col < len(r) and r[id_col] is not None else ''
            row_name = str(r[name_col]).strip() if name_col is not None and name_col < len(r) and r[name_col] is not None else ''
            row_price_raw = r[price_col] if price_col is not None and price_col < len(r) else None
            row_price = clean_price(row_price_raw)
            row_unit = str(r[unit_col]).strip() if unit_col is not None and unit_col < len(r) and r[unit_col] is not None else None
            
            # Ищем совпадение в каталоге
            target_product = None
            if row_id and row_id.lower() in by_id:
                target_product = by_id[row_id.lower()]
            elif row_name and row_name.lower() in by_name:
                target_product = by_name[row_name.lower()]
                
            if target_product:
                changed = False
                if row_price is not None and target_product.get('price') != row_price:
                    target_product['price'] = row_price
                    changed = True
                if row_name and len(row_name) > 3 and target_product.get('name') != row_name:
                    target_product['name'] = row_name
                    changed = True
                if row_unit and target_product.get('unit') != row_unit:
                    target_product['unit'] = row_unit
                    changed = True
                    
                if changed:
                    file_updated += 1
                    updated_count += 1
            elif row_id and row_name and row_price is not None:
                # Новый товар
                new_item = {
                    "id": row_id,
                    "name": row_name,
                    "description": "",
                    "direction": "Общее",
                    "category": "Новые поступления",
                    "unit": row_unit or "шт.",
                    "price": row_price,
                    "image": ""
                }
                products.append(new_item)
                by_id[row_id.lower()] = new_item
                by_name[row_name.lower()] = new_item
                new_products_count += 1
                
        print(f"[+] Из файла '{filename}' обновлено позиций: {file_updated}")
        
    if updated_count > 0 or new_products_count > 0:
        catalog_data['products'] = products
        save_catalog(catalog_data)
        print("\n=======================================================")
        print(f"[✔] УСПЕШНО ЗАВЕРШЕНО!")
        print(f"    - Обновлено существующих товаров: {updated_count}")
        print(f"    - Добавлено новых позиций: {new_products_count}")
        print(f"    - Всего товаров в каталоге: {len(products)}")
        print("=======================================================\n")
    else:
        print("\n[i] Никаких изменений не обнаружено (цены и наименования уже совпадают).")

if __name__ == '__main__':
    process_updates()
