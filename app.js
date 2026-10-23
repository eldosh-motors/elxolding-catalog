'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const words={catalog:['Каталог','Katalog'],about:['О компании','Kompaniya haqida'],cart:['Корзина','Savat'],hero:['Оснащаем образование будущего','Kelajak ta’limini jihozlaymiz'],intro:['Современное учебное и лабораторное оборудование от ведущего производителя Узбекистана с 1988 года.','1988-yildan buyon O‘zbekistonning yetakchi ishlab chiqaruvchisidan zamonaviy o‘quv va laboratoriya jihozlari.'],search:['Название или артикул…','Nomi yoki artikul…'],all:['Все направления','Barcha yo‘nalishlar'],name:['По названию','Nomi bo‘yicha'],cheap:['Сначала дешевле','Avval arzonlari'],expensive:['Сначала дороже','Avval qimmatlari'],found:['Найдено','Topildi'],add:['В корзину','Savatga'],added:['Товар добавлен в корзину','Mahsulot savatga qo‘shildi'],inCart:['В корзине','Savatda'],unknown:['Уточните у менеджера','Menejerdan aniqlashtiring'],currency:['сум','so‘m'],empty:['Корзина пока пуста','Savat hozircha bo‘sh'],noResults:['Товары не найдены','Mahsulot topilmadi'],back:['В каталог','Katalogga'],clear:['Очистить корзину','Savatni tozalash'],clearConfirm:['Удалить все товары из корзины?','Savatdagi barcha mahsulotlar o‘chirilsinmi?'],yourOrder:['Ваша заявка','Sizning so‘rovingiz'],customer:['Имя / организация','Ism / tashkilot'],phone:['Телефон','Telefon'],city:['Город / адрес доставки','Shahar / yetkazish manzili'],note:['Комментарий','Izoh'],total:['Итого (с учётом НДС)','Jami (QQS bilan birga)'],unknownNote:['Есть товары без цены. Их стоимость уточнит менеджер; в итог они не включены.','Narxi ko‘rsatilmagan mahsulotlar bor. Ularning narxini menejer aniqlashtiradi; ular jamiga kiritilmagan.'],download:['Скачать спецификацию (Excel)','Spetsifikatsiyani yuklab olish (Excel)'],pdf:['Excel','Excel'],hint:['Заполните данные и скачайте спецификацию в Excel для отправки менеджеру.','Ma’lumotlarni to‘ldiring va spetsifikatsiyani Excelda menejerga yuborish uchun yuklab oling.'],remove:['Удалить из корзины','Savatdan o‘chirish'],quantity:['Количество','Miqdor'],price:['Цена с НДС','QQS bilan narxi'],sum:['Сумма','Summa'],unit:['Ед. изм.','O‘lchov birligi'],product:['Наименование продукции','Mahsulot nomi'],article:['Артикул','Artikul'],date:['Дата и время','Sana va vaqt'],request:['Заявка','So‘rov'],notConfirmed:['Заявка требует подтверждения менеджером.','So‘rov menejer tomonidan tasdiqlanishi kerak.'],photo:['Фото','Surat'],noPhoto:['Фото отсутствует','Surat yo‘q'],downloaded:['Спецификация Excel скачана. Отправьте файл менеджеру.','Excel spetsifikatsiyasi yuklab olindi. Faylni menejerga yuboring.'],page:['Страница','Sahifa'],details:['Подробнее','Batafsil'],close:['Закрыть','Yopish'],required:['Укажите имя и телефон для связи.','Bog‘lanish uchun ism va telefonni kiriting.']};
Object.assign(words,{tiles:['Плитки','Plitkalar'],list:['Список','Ro‘yxat'],pageSize:['Показывать','Ko‘rsatish'],unknown:['Уточните у менеджера','Menejerdan aniqlashtiring'],search:['Название, артикул или описание…','Nomi, artikul yoki tavsifi…']});
function getDisplayControlsHtml(){
  return `<div class="view-options" role="group" aria-label="${t('catalog')}"><button type="button" data-view="grid" class="${state.view==='grid'?'active':''}" aria-pressed="${state.view==='grid'}">▦ ${t('tiles')}</button><button type="button" data-view="list" class="${state.view==='list'?'active':''}" aria-pressed="${state.view==='list'}">☷ ${t('list')}</button></div><div class="col-selector" style="${state.view==='list'?'display:none':''}"><span class="col-label">${state.lang==='uz'?'Ustunlar:':'В ряд:'}</span><div class="col-buttons">${[3,4,5,6,7,8].map(n=>`<button type="button" data-cols="${n}" class="col-btn ${state.cols===n?'active':''}">${n}</button>`).join('')}</div></div><label>${t('pageSize')}<select class="page-size-select" aria-label="${t('pageSize')}">${[50,100,500,1000].map(n=>`<option value="${n}" ${n===state.pageSize?'selected':''}>${n}</option>`).join('')}</select></label>`;
}

function installDisplayControls(){
  const topContainer=$('#display-options');
  const bottomContainer=$('#display-options-bottom');
  const html = getDisplayControlsHtml();
  if(topContainer) topContainer.innerHTML = html;
  if(bottomContainer) bottomContainer.innerHTML = html;

  document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
    state.view=button.dataset.view;
    try{localStorage.setItem('elx-client-view',JSON.stringify(state.view))}catch{}
    installDisplayControls();
    renderResults();
  });

  document.querySelectorAll('[data-cols]').forEach(btn=>btn.onclick=()=>{
    state.cols=Number(btn.dataset.cols);
    try{localStorage.setItem('elx-client-cols',JSON.stringify(state.cols))}catch{}
    installDisplayControls();
    renderResults();
  });

  document.querySelectorAll('.page-size-select').forEach(sel=>sel.onchange=e=>{
    state.pageSize=Number(e.target.value);
    state.pageNo=1;
    try{localStorage.setItem('elx-client-page-size',JSON.stringify(state.pageSize))}catch{}
    installDisplayControls();
    renderResults();
  });
}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const products=window.CATALOG.products,byId=new Map(products.map(p=>[String(p.id),p]));
const state={lang:read('elx-client-language','ru')==='uz'?'uz':'ru',cart:[],page:'catalog',query:'',direction:'',sort:'name',pageNo:1,pageSize:[50,100,500,1000].includes(Number(read('elx-client-page-size',50)))?Number(read('elx-client-page-size',50)):50,view:read('elx-client-view','grid')==='list'?'list':'grid',cols:Number(read('elx-client-cols',4)),customer:{name:'',phone:'',city:'',note:''}};
const storedCart=read('elx-client-cart',[]);
for(const item of Array.isArray(storedCart)?storedCart:[]){if(!item||typeof item!=='object')continue;const n=Number(item.quantity);if(byId.has(String(item.id))&&Number.isFinite(n)&&n>0)state.cart.push({id:String(item.id),quantity:Math.min(n,999999)})}
function t(key){return words[key]?.[state.lang==='uz'?1:0]||key}
function field(p,key){return (state.lang==='uz'?p.uz?.[key]:null)||p[key]||''}
const formatter={ru:new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}),uz:new Intl.NumberFormat('uz-UZ',{minimumFractionDigits:2,maximumFractionDigits:2})};
const money=n=>formatter[state.lang].format(n),round=n=>Math.round((n+Number.EPSILON)*100)/100;
const cartSVG='<svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
function photo(p,small=true){return p.image?`${p.image}${small?'-thumb':''}.jpg`:''}
function image(p,small=true){return p.image?`<img src="${esc(photo(p,small))}" alt="${esc(field(p,'name'))}" loading="lazy" decoding="async">`:`<span class="muted">${t('noPhoto')}</span>`}
function price(p){return `<small class="no-price">${t('unknown')}</small>`}
function save(){try{localStorage.setItem('elx-client-cart',JSON.stringify(state.cart))}catch{}updateNav()}
function updateNav(){
  $('#catalog-link').textContent=t('catalog');
  const aboutBtn=$('#about-link');if(aboutBtn)aboutBtn.textContent=t('about');
  $('#guide-link').textContent=state.lang==='uz'?'Qanday buyurtma beriladi':'Как заказать';
  $('#cart-link').textContent=`${t('cart')} · ${state.cart.length}`;
  $('#language').value=state.lang;
  document.documentElement.lang=state.lang==='uz'?'uz-Latn':'ru';
  document.title=`ELXOLDING — ${t('catalog')}`;
  $('#product-dialog .close').setAttribute('aria-label',t('close'));
}
let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3500)}
function go(page){state.page=page;render();window.scrollTo({top:0,behavior:'smooth'})}
function render(){updateNav();if(state.page==='about')renderAbout();else if(state.page==='guide')renderGuide();else if(state.page==='cart')renderCart();else renderCatalog();let footer=$('#site-footer');if(!footer){footer=document.createElement('footer');footer.id='site-footer';$('#app').after(footer)}footer.innerHTML=`<strong>ELXOLDING SMART CATALOG</strong><span>${state.lang==='uz'?'Ta’lim uchun jihozlar · Mahsulotlarni tanlash va buyurtma so‘rovlari':'Оборудование для образования · Каталог и заявки'}</span><button class="plain" data-go="guide">${state.lang==='uz'?'Qanday buyurtma beriladi':'Как заказать'}</button>`}
function renderGuide(){const uz=state.lang==='uz';const steps=uz?[
 ['Mahsulotlar assortimentini o‘rganing','Mahsulot toifalari bilan tanishing, fotosuratlar, tavsiflar va xususiyatlarni o‘rganing. Kerakli mahsulotni nomi yoki artikuli bo‘yicha toping.'],
 ['Savatni shakllantiring','Kerakli tovarlarni tanlang, ularni savatga qo‘shing va miqdorini ko‘rsating. Barcha tanlangan mahsulotlar bir joyda jamlanadi.'],
 ['So‘rovni rasmiylashtiring','Aloqa ma’lumotlari va qo‘shimcha ma’lumotlarni kiriting. Tayyor so‘rovni qulay formatda saqlang: PDF, Excel CSV yoki TXT.'],
 ['Tijorat taklifini oling','Mavjudlik, narxlar, to‘lov va yetkazib berish shartlarini aniqlashtirish uchun so‘rovni ELXOLDING menejeriga yuboring.']
 ]:[
 ['Изучите ассортимент','Ознакомьтесь с категориями товаров, изучайте фотографии, описания и характеристики. Находите нужную продукцию по названию или артикулу.'],
 ['Сформируйте корзину','Выбирайте необходимые товары, добавляйте их в корзину и указывайте количество. Все выбранные позиции будут собраны в одном месте.'],
 ['Оформите заявку','Укажите контактные данные и дополнительную информацию. Сохраните готовую заявку в удобном формате: PDF, Excel CSV или TXT.'],
 ['Получите коммерческое предложение','Передайте заявку менеджеру ELXOLDING для уточнения наличия, стоимости, условий оплаты и доставки.']
 ];$('#app').innerHTML=`<section class="hero"><div class="eyebrow">ELXOLDING / SMART CATALOG</div><h1>${uz?'Qanday buyurtma beriladi':'Как оформить заявку'}</h1><p>${uz?'Tanlashdan tasdiqlashgacha — to‘rt oddiy qadam.':'От выбора оборудования до подтверждения — четыре простых шага.'}</p></section><div class="guide-grid">${steps.map((s,n)=>`<article class="guide-step"><span>${n+1}</span><h2>${s[0]}</h2><p>${s[1]}</p></article>`).join('')}</div><div class="guide-actions"><button class="primary" data-go="catalog">${t('back')}</button><button data-go="cart">${t('cart')}</button></div>`}
function renderCatalog(){const dirs=[...new Set(products.map(p=>p.direction).filter(Boolean))];$('#app').innerHTML=`<section class="hero"><div class="eyebrow">ELXOLDING / SMART CATALOG</div><h1>${t('hero')}</h1><p>${t('intro')}</p></section><div class="tools"><input id="search" type="search" value="${esc(state.query)}" placeholder="${t('search')}" aria-label="${t('search')}"><select id="direction" aria-label="${t('all')}"><option value="">${t('all')}</option>${dirs.map(d=>`<option value="${esc(d)}" ${d===state.direction?'selected':''}>${esc(field(products.find(p=>p.direction===d),'direction'))}</option>`).join('')}</select><select id="sort" aria-label="${t('name')}">${['name'].map(k=>`<option value="${k}" ${state.sort===k?'selected':''}>${t(k)}</option>`).join('')}</select></div><div id="display-options"></div><div id="results"></div><div id="display-options-bottom"></div>`;installDisplayControls();renderResults();let timer;$('#search').oninput=e=>{state.query=e.target.value;state.pageNo=1;clearTimeout(timer);timer=setTimeout(renderResults,130)};$('#direction').onchange=e=>{state.direction=e.target.value;state.pageNo=1;renderResults()};$('#sort').onchange=e=>{state.sort=e.target.value;state.pageNo=1;renderResults()}}
function renderResults(){
  const query=state.query.trim().toLocaleLowerCase();
  const rows=products.filter(p=>(!state.direction||p.direction===state.direction)&&(!query||[p.id,p.name,p.description,p.uz?.name,p.uz?.description].join(' ').toLocaleLowerCase().includes(query))).sort((a,b)=>{if(state.sort==='name')return field(a,'name').localeCompare(field(b,'name'),state.lang);const ap=Number(a.price)||Infinity,bp=Number(b.price)||Infinity;if(ap===Infinity||bp===Infinity)return ap===bp?0:ap===Infinity?1:-1;return state.sort==='cheap'?ap-bp:bp-ap});
  const pages=Math.max(1,Math.ceil(rows.length/state.pageSize));
  state.pageNo=Math.min(state.pageNo,pages);

  const pagerHtml = `<div class="pager"><button data-page="-1" ${state.pageNo===1?'disabled':''}>←</button><span>${t('page')} ${state.pageNo} / ${pages}</span><button data-page="1" ${state.pageNo===pages?'disabled':''}>→</button></div>`;

  $('#results').innerHTML=`<div class="results-top-bar"><div class="count">${t('found')}: ${rows.length}</div>${pages > 1 ? pagerHtml : ''}</div>`+(rows.length?`<div class="grid cols-${state.cols||4} ${state.view==='list'?'list':''}">${rows.slice((state.pageNo-1)*state.pageSize,state.pageNo*state.pageSize).map(p=>`<article class="card"><button class="photo" data-detail="${esc(p.id)}" aria-label="${t('details')}: ${esc(field(p,'name'))}">${image(p)}</button><div class="card-body"><span class="category">${esc(field(p,'direction'))}</span><h3>${esc(field(p,'name'))}</h3><span class="muted">${t('article')}: ${esc(p.id)} · ${esc(field(p,'unit'))}</span><div class="bottom"><span class="price">${price(p)}</span><button class="primary" data-add="${esc(p.id)}" title="${t('add')}" aria-label="${t('add')}: ${esc(field(p,'name'))}">${cartSVG}</button></div></div></article>`).join('')}</div>${pagerHtml}`:`<div class="empty">${t('noResults')}</div>`);
}
function add(id){const item=state.cart.find(i=>i.id===id);if(item)item.quantity=Math.min(999999,round(item.quantity+1));else state.cart.push({id,quantity:1});save();toast(t('added'))}
function detail(id){const p=byId.get(id);if(!p)return;$('#product-detail').dataset.id=id;$('#product-detail').innerHTML=`<div class="detail"><div>${image(p,false)}</div><div><span class="category">${esc(field(p,'direction'))}</span><h2>${esc(field(p,'name'))}</h2><div class="muted">${t('article')}: ${esc(p.id)}</div><div class="price">${price(p)}</div><p>${esc(field(p,'description'))}</p><button class="primary" data-add="${esc(p.id)}">${t('add')}</button></div></div>`;if(!$('#product-dialog').open)$('#product-dialog').showModal()}
function amount(){return round(state.cart.reduce((sum,item)=>sum+round(Number(byId.get(item.id).price||0)*item.quantity),0))}
function hasUnknown(){return state.cart.some(i=>!(Number(byId.get(i.id).price)>0))}
function generateExcelXml(o){
  const escXml=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const dateStr=new Date().toLocaleDateString('ru-RU');
  const org=state.customer.organization?state.customer.organization.trim():'';
  const cust=state.customer.name?state.customer.name.trim():'';
  const rawTarget=org||cust||'Покупатель';
  const cleanedTarget=rawTarget.replace(/^[«"'\s]+|[»"'\s]+$/g,'');
  const customerName=`&quot;${escXml(cleanedTarget)}&quot;`;
  
  let rowsXml='';
  o.items.forEach((item,index)=>{
    const n=index+1;
    const name=escXml(item.name);
    const unit=escXml(item.unit||'шт.');
    const qty=item.quantity;
    const priceVal=item.price!=null?Number(item.price):0;
    const sumVal=item.sum!=null?Number(item.sum):priceVal*qty;
    
    rowsXml+=`   <Row ss:Height="22">
    <Cell ss:StyleID="center"><Data ss:Type="Number">${n}</Data></Cell>
    <Cell ss:StyleID="name"><Data ss:Type="String">${name}</Data></Cell>
    <Cell ss:StyleID="center"><Data ss:Type="String">${unit}</Data></Cell>
    <Cell ss:StyleID="qty"><Data ss:Type="Number">${qty}</Data></Cell>
    <Cell ss:StyleID="money">${priceVal>0?`<Data ss:Type="Number">${priceVal}</Data>`:`<Data ss:Type="String">${escXml(t('unknown'))}</Data>`}</Cell>
    <Cell ss:StyleID="money">${sumVal>0?`<Data ss:Type="Number">${sumVal}</Data>`:`<Data ss:Type="String">${escXml(t('unknown'))}</Data>`}</Cell>
   </Row>\n`;
  });

  const tot=amount();

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="appRight">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Italic="1"/>
  </Style>
  <Style ss:ID="titleDoc">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="12" ss:Bold="1"/>
  </Style>
  <Style ss:ID="buyer">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Bold="1"/>
  </Style>
  <Style ss:ID="th">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10" ss:Bold="1"/>
  </Style>
  <Style ss:ID="center">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10"/>
  </Style>
  <Style ss:ID="name">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10"/>
  </Style>
  <Style ss:ID="qty">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="money">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="totalLabel">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="10" ss:Bold="1"/>
  </Style>
  <Style ss:ID="totalEmpty">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="totalSum">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="signHead">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Bold="1"/>
  </Style>
  <Style ss:ID="signRow">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Times New Roman" x:CharSet="204" ss:Size="11" ss:Bold="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Спецификация">
  <Table ss:DefaultRowHeight="18">
   <Column ss:Index="1" ss:Width="30"/>
   <Column ss:Index="2" ss:Width="300"/>
   <Column ss:Index="3" ss:Width="55"/>
   <Column ss:Index="4" ss:Width="45"/>
   <Column ss:Index="5" ss:Width="80"/>
   <Column ss:Index="6" ss:Width="95"/>
   
   <Row ss:Index="1" ss:Height="24">
    <Cell ss:Index="1" ss:MergeAcross="5" ss:StyleID="titleDoc"><Data ss:Type="String">Спецификация к договору от ${dateStr} года.</Data></Cell>
   </Row>
   <Row ss:Index="3" ss:Height="22">
    <Cell ss:Index="1" ss:MergeAcross="5" ss:StyleID="buyer"><Data ss:Type="String">Заказчик: ${customerName}</Data></Cell>
   </Row>
   <Row ss:Index="5" ss:Height="28">
    <Cell ss:StyleID="th"><Data ss:Type="String">№</Data></Cell>
    <Cell ss:StyleID="th"><Data ss:Type="String">Наименование продукции</Data></Cell>
    <Cell ss:StyleID="th"><Data ss:Type="String">ед.изм</Data></Cell>
    <Cell ss:StyleID="th"><Data ss:Type="String">К-во</Data></Cell>
    <Cell ss:StyleID="th"><Data ss:Type="String">Цена с&#10;НДС</Data></Cell>
    <Cell ss:StyleID="th"><Data ss:Type="String">Сумма с НДС</Data></Cell>
   </Row>
${rowsXml}   <Row ss:Height="22">
    <Cell ss:MergeAcross="4" ss:StyleID="totalLabel"><Data ss:Type="String">ИТОГО</Data></Cell>
    <Cell ss:StyleID="totalSum"><Data ss:Type="Number">${tot}</Data></Cell>
   </Row>
   <Row ss:Index="${8 + o.items.length + 3}" ss:Height="25">
    <Cell ss:Index="1" ss:MergeAcross="2" ss:StyleID="signHead"><Data ss:Type="String">ООО НПО ELXOLDING</Data></Cell>
    <Cell ss:Index="4" ss:MergeAcross="2" ss:StyleID="signHead"><Data ss:Type="String">${customerName}</Data></Cell>
   </Row>
   <Row ss:Index="${8 + o.items.length + 6}" ss:Height="22">
    <Cell ss:Index="1" ss:MergeAcross="2" ss:StyleID="signRow"><Data ss:Type="String">Ли Ю. А.      _________________</Data></Cell>
    <Cell ss:Index="4" ss:MergeAcross="2" ss:StyleID="signRow"><Data ss:Type="String">Руководитель  _________________</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;
}

function renderCart(){if(!state.cart.length){$('#app').innerHTML=`<div class="empty"><h2>${t('empty')}</h2><button class="primary" data-go="catalog">${t('back')}</button></div>`;return}$('#app').innerHTML=`<div class="heading"><div><h1>${t('cart')}</h1></div><button data-go="catalog">← ${t('back')}</button></div><div class="cart-layout"><section class="cart-list"><div class="cart-table-head"><span class="col-num">№</span><span class="col-photo">${t('photo')}</span><span class="col-name">${t('product')}</span><span class="col-unit">${t('unit')}</span><span class="col-qty">${state.lang==='uz'?'Miqdor':'К-во'}</span><span class="col-del"></span></div>${state.cart.map((item,idx)=>{const p=byId.get(item.id);return `<div class="cart-row" data-row="${esc(item.id)}"><span class="item-num">${idx+1}</span><button type="button" class="cart-row-thumb" data-detail="${esc(item.id)}" title="${t('details')}">${image(p)}</button><div class="cart-row-info"><strong class="cart-title-btn" data-detail="${esc(item.id)}">${esc(field(p,'name'))}</strong><small class="muted">${t('article')}: ${esc(p.id)}</small></div><div class="cart-row-unit">${esc(field(p,'unit'))||'шт.'}</div><input type="number" data-quantity="${esc(p.id)}" value="${item.quantity}" min="0.001" max="999999" step="any" aria-label="${t('quantity')}: ${esc(field(p,'name'))}"><button class="remove" data-remove="${esc(p.id)}" title="${t('remove')}" aria-label="${t('remove')}"><svg class="remove-ico" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`}).join('')}<button class="plain" id="clear">${t('clear')}</button></section><form class="summary" id="order-form"><h2>${t('yourOrder')}</h2>${['name','phone','city'].map(k=>`<label>${t(k==='name'?'customer':k)}${['name','phone'].includes(k)?' *':''}<input name="${k}" type="${k==='phone'?'tel':'text'}" value="${esc(state.customer[k])}" maxlength="${k==='phone'?50:200}" ${['name','phone'].includes(k)?'required':''} autocomplete="${k==='name'?'name':k==='phone'?'tel':'street-address'}"></label>`).join('')}<label>${t('note')}<textarea name="note" maxlength="2000">${esc(state.customer.note)}</textarea></label><p class="notice no-price" style="font-size:15px;font-weight:700;color:var(--teal);">${t('unknown')}</p><button class="primary" type="submit">${t('download')}</button><p class="notice">${t('hint')}</p></form></div>`;$('#order-form').oninput=e=>{if(e.target.name in state.customer)state.customer[e.target.name]=e.target.value};$('#order-form').onsubmit=e=>{e.preventDefault();exportOrder('excel')};$('#clear').onclick=()=>{if(confirm(t('clearConfirm'))){state.cart=[];save();renderCart()}}}
function order(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tashkent',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));return {stamp:`${v.day}.${v.month}.${v.year}_${v.hour}-${v.minute}-${v.second}`,display:`${v.day}.${v.month}.${v.year} ${v.hour}:${v.minute}:${v.second}`,items:state.cart.map(i=>{const p=byId.get(i.id);return {id:p.id,name:field(p,'name'),unit:field(p,'unit'),quantity:i.quantity,price:Number(p.price)>0?Number(p.price):null,image:photo(p),sum:Number(p.price)>0?round(p.price*i.quantity):null}})}}
function download(content,type,filename){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast(t('downloaded'))}
function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
async function exportOrder(format){
  const form=$('#order-form');
  if(!form.reportValidity())return;
  if(!state.customer.name.trim()||!state.customer.phone.trim()){toast(t('required'));return}
  const o=order();
  const filename=`ELXOLDING_${state.lang==='uz'?'Spetsifikatsiya':'Спецификация'}_${o.stamp}.xls`;
  const xmlContent=generateExcelXml(o);
  download(xmlContent,'application/vnd.ms-excel;charset=utf-8',filename);
}
document.addEventListener('click',e=>{const addButton=e.target.closest('[data-add]'),detailButton=e.target.closest('[data-detail]'),remove=e.target.closest('[data-remove]'),page=e.target.closest('[data-page]'),goButton=e.target.closest('[data-go]');if(addButton)add(addButton.dataset.add);else if(detailButton)detail(detailButton.dataset.detail);else if(remove){state.cart=state.cart.filter(i=>i.id!==remove.dataset.remove);save();renderCart()}else if(page){state.pageNo+=Number(page.dataset.page);renderResults();$('#results').scrollIntoView({behavior:'smooth',block:'start'})}else if(goButton)go(goButton.dataset.go)});
document.addEventListener('input',e=>{const id=e.target.dataset.quantity;if(!id)return;const n=Number(e.target.value);if(!Number.isFinite(n)||n<.001||n>999999)return;const item=state.cart.find(i=>i.id===id);item.quantity=Math.round(n*1000)/1000;save()});
document.addEventListener('change',e=>{if(e.target.dataset.quantity&&!e.target.checkValidity()){const item=state.cart.find(i=>i.id===e.target.dataset.quantity);e.target.value=item.quantity}});
function renderAbout(){
  const uz=state.lang==='uz';
  $('#app').innerHTML=`
    <section class="about-hero hero">
      <div class="eyebrow">ELXOLDING / ${uz?'KOMPANIYA HAQIDA':'О КОМПАНИИ'}</div>
      <h1>${uz?'Ilmiy-ishlab chiqarish birlashmasi ELXOLDING':'Научно-производственное объединение ELXOLDING'}</h1>
      <p class="about-motto">«${uz?'Ta’lim sohasini rivojlantirish — g‘oyadan to o‘quv jarayonini ta’minlashgacha':'Развитие образовательного сектора — от идеи до обеспечения учебного процесса'}»</p>
      <p>${uz?'1988-yildan buyon ta’lim, fan va sanoat uchun zamonaviy laboratoriya uskunalari, maxsus mebellar va ko‘rgazmali qo‘llanmalar ishlab chiqaruvchi O‘zbekiston va Markaziy Osiyodagi yetakchi korxona.':'С 1988 года — ведущий производитель учебно-лабораторного оборудования, специализированной мебели и наглядных пособий для образования, науки и промышленности Узбекистана и Центральной Азии.'}</p>
    </section>

    <div class="about-stats-grid">
      <div class="stat-card">
        <div class="stat-num" data-target="1988">1988</div>
        <div class="stat-label">${uz?'Tashkil etilgan yili':'Год основания предприятия'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-target="24000" data-format="spaced" data-suffix=" м²">24 000 м²</div>
        <div class="stat-label">${uz?'Ishlab chiqarish maydoni (2.24 ga hududda)':'Производственные площади (2.24 га)'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-target="250" data-suffix="+">250+</div>
        <div class="stat-label">${uz?'Uskunalar (jumladan 29 ta CNC stanogi)':'Единиц оборудования (в т.ч. 29 ЧПУ)'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-target="83">83</div>
        <div class="stat-label">${uz?'O‘zbekiston Respublikasi patentlari':'Патентов Республики Узбекистан'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-target="300" data-suffix="+">300+</div>
        <div class="stat-label">${uz?'Xodimlar (100+ oliy ma’lumotli mutaxassis)':'Сотрудников (100+ с высшим образ.)'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num stat-iso">ISO 9001</div>
        <div class="stat-label">${uz?'2004-yildan buyon xalqaro sifat sertifikati':'Международный стандарт качества с 2004 г.'}</div>
      </div>
    </div>

    <div class="about-content-layout">
      <article class="about-card main-card">
        <h2>${uz?'Faoliyat va ishlab chiqarish imkoniyatlari':'Деятельность и производственные мощности'}</h2>
        <p>${uz?'ООО НПО «ELXOLDING» Samarqand shahrida joylashgan yirik ko‘p tarmoqli ishlab chiqarish majmuasiga ega (2,24 gektar hududda 24 000 kv. m dan ortiq ishlab chiqarish maydonlari). Korxona «g‘oyadan to o‘quv jarayonini to‘liq ta’minlashgacha» tamoyili asosida to‘liq tsiklda faoliyat yuritadi.':'ООО НПО «ELXOLDING» располагает масштабным производственным комплексом в г. Самарканде на территории 2,24 гектара с производственными площадями свыше 24 000 кв. м. Предприятие реализует полный замкнутый цикл «от зарождения идеи до серийного производства и сервисного обслуживания».'}</p>
        <p>${uz?'1997-yildan boshlab asosiy e’tibor ta’lim muassasalarini (maktablar, kasb-hunar kollejlari, akademik litseylar va oliy o‘quv yurtlari) zamonaviy fan kabinetlari va laboratoriyalar bilan to‘liq jihozlashga qaratilgan. Kompaniya 2000-yildan buyon Ta’lim materiallari ishlab chiqaruvchilar xalqaro assotsiatsiyasi — «WORLDDIDAC» (Bern, Shveysariya) a’zosi hisoblanadi.':'С 1997 года ключевым направлением стала разработка и выпуск современного оборудования и учебных кабинетов для школ, колледжей, лицеев и вузов страны. С 2000 года «ELXOLDING» входит во Всемирную Ассоциацию производителей образовательных материалов «WORLDDIDAC» (Берн, Швейцария).'}</p>
        
        <h3>${uz?'Asosiy yo‘nalishlar:':'Ключевые направления продукции:'}</h3>
        <ul class="about-list">
          <li><strong>${uz?'Kimyo, Fizika va Biologiya:':'Химия, Физика и Биология:'}</strong> ${uz?'laboratoriya asboblari, reaktivlar, kimyoviy idishlar, mikroskoplar, gerbariylar, tabiiy preparatlar va modellar.':'лабораторные приборы, реактивы, лабораторная посуда, микроскопы, гербарии, влажные и пластиковые препараты, анатомические модели.'}</li>
          <li><strong>${uz?'Tabiiy fanlar va Boshlang‘ich ta’lim:':'Естествознание и Начальные классы:'}</strong> ${uz?'atrof-olamni o‘rganish to‘plamlari, ko‘rgazmali bloklar va amaliy qo‘llanmalar.':'наборы для изучения окружающего мира, демонстрационные блоки, раздаточные материалы.'}</li>
          <li><strong>${uz?'Ixtisoslashtirilgan laboratoriya mebellari:':'Специализированная мебель:'}</strong> ${uz?'tortuvchi shkaflar, laboratoriya stollari, kislotaga chidamli yuzalar va jihozlar.':'вытяжные шкафы, островные и пристенные лабораторные столы, стулья, мойки, устойчивые к химическим воздействиям.'}</li>
          <li><strong>${uz?'Raqamli ta’lim va IT:':'Цифровое образование:'}</strong> ${uz?'interaktiv panellar, kompyuter sinflari, raqamli laboratoriyalar va datchiklar.':'интерактивные панели, компьютерные классы, цифровые лаборатории и датчики.'}</li>
          <li><strong>${uz?'Tibbiy va gigiyenik uskunalar:':'Медицинское оборудование:'}</strong> ${uz?'bakteritsid retsirkulyator-havo tozalagichlar (UVEL seriyasi).':'бактерицидные облучатели-рециркуляторы воздуха (серия UVEL).'}</li>
        </ul>

        <h3>${uz?'Innovatsiyalar va ilmiy yondashuv:':'Инновации и научный потенциал:'}</h3>
        <p>${uz?'Korxonaning ilmiy-uslubiy bo‘limida olimlar, muhandislar va tajribali pedagoglar faoliyat yuritadi. 83 ta patent olingan, 40 dan ortiq ilmiy-uslubiy ishlar chop etilgan. Mahsulotlarimiz «O‘zstandart» agentligi sertifikatlariga ega hamda «O‘zbekistonning eng yaxshi mahsuloti» diplomi bilan taqdirlangan.':'В научно-методическом блоке предприятия работают ученые, инженеры и опытные педагоги. Разработки защищены 83 патентами Республики Узбекистан, опубликовано свыше 40 научных трудов. Оборудование сертифицировано Агентством «Узстандарт» и удостоено диплома «Лучшая продукция Узбекистана».'}</p>
      </article>

      <article class="about-card side-card">
        <h2>${uz?'Yirik loyihalar va xalqaro yutuqlar':'Крупные проекты и достижения'}</h2>
        
        <div class="achievement-item">
          <strong>${uz?'Islom taraqqiyot banki (2022)':'Исламский банк развития (2022)'}</strong>
          <p>${uz?'«Oliy ta’lim muassasalarining moddiy-texnik bazasini mustahkamlash» loyihasi doirasida O‘zbekistonning 58 ta OTMlarida 13 ta yo‘nalish bo‘yicha zamonaviy laboratoriyalar to‘liq jihozlandi.':'В рамках проекта «Укрепление материально-технической базы высших учебных заведений» оснащены лаборатории по 13 направлениям в 58 вузах Узбекистана.'}</p>
        </div>

        <div class="achievement-item">
          <strong>${uz?'Jahon banki loyihalari':'Проекты Всемирного банка'}</strong>
          <p>${uz?'«Oliy ta’lim tizimini modernizatsiya qilish» doirasida 37 ta OTMda 35 ta yo‘nalish bo‘yicha laboratoriyalar, shuningdek ToshDTU laboratoriyalari va Sabzavot-poliz ekinlari ITI uchun 10 ta laboratoriya jihozlandi.':'В рамках «Модернизации высшего образования» оснащены лаборатории по 35 направлениям в 37 вузах, научная лаборатория ТашГТУ и 10 лабораторий НИИ овощебахчевых культур.'}</p>
        </div>

        <div class="achievement-item">
          <strong>${uz?'Xalqaro Mendeleyev kimyo olimpiadasi':'Международная Менделеевская олимпиада'}</strong>
          <p>${uz?'2008–2015-yillarda Toshkent, Ashxobod, Boku va Ostonada o‘tkazilgan Xalqaro Mendeleyev kimyo olimpiadasi amaliy turlarining eksklyuziv jihozlash hamkori.':'С 2008 по 2015 годы — эксклюзивный поставщик оборудования для экспериментальных туров Менделеевской олимпиады по химии (Ташкент, Ашхабад, Баку, Астана).'}</p>
        </div>

        <div class="achievement-item">
          <strong>${uz?'Xalqaro eksport va tenderlar':'Международный экспорт и школы'}</strong>
          <p>${uz?'2021–2023 yillarda xalqaro tenderlar bo‘yicha Belarusdagi 50 ta va Rossiyadagi 68 ta maktab to‘liq jihozlandi. Eksport geografiyasi: Qozog‘iston, Turkmaniston, Tojikiston, Ozarbayjon, Armaniston, Latviya.':'В 2021–2023 гг. по международным тендерам оснащены 50 школ в Беларуси и 68 школ в РФ. Продукция экспортируется в Казахстан, Туркменистан, Таджикистан, Азербайджан, Армению, Латвию.'}</p>
        </div>

        <div class="achievement-item">
          <strong>${uz?'Xalqaro sifat standarti ISO 9001':'Международный стандарт ISO 9001'}</strong>
          <p>${uz?'Xalqaro sifat menejmenti tizimi (ISO 9001) korxonada 2004-yildan buyon muvaffaqiyatli amal qilmoqda.':'Международная система менеджмента качества ISO 9001 непрерывно поддерживается с 2004 года.'}</p>
        </div>
      </article>
    </div>

    <section class="about-factory-block">
      <h2>${uz?'Ishlab chiqarish quvvatlari va zavod galereyasi':'Производственный комплекс и цеха завода'}</h2>
      <p class="factory-desc">${uz?'24 000 m² ishlab chiqarish maydonlari, zamonaviy CNC uskunalar va yuqori aniqlikdagi laboratoriya texnologiyalari.':'Более 24 000 м² современных цехов, 250+ единиц оборудования, ЧПУ-станки и замкнутый цикл производства.'}</p>
      <div class="factory-gallery-grid">
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_1.jpg" alt="Производство ELXOLDING" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'CNC va metallga ishlov berish sexi':'Цех металлообработки и ЧПУ'}</span>
        </div>
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_2.jpg" alt="Цех мебели и сборки" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'Laboratoriya mebellari ishlab chiqarish':'Производство специализированной мебели'}</span>
        </div>
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_3.jpg" alt="Химическая лаборатория" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'Kimyo va biologiya laboratoriyalari':'Учебно-лабораторные комплексы'}</span>
        </div>
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_4.jpg" alt="Сборочный цех" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'Yig‘uv va sinov maydoni':'Сборочно-испытательный участок'}</span>
        </div>
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_5.jpg" alt="Контроль качества" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'Sifat nazorati va qadoqlash':'Контроль качества и комплектация'}</span>
        </div>
        <div class="factory-photo-card">
          <div class="factory-img-wrap">
            <img src="assets/factory/factory_6.jpg" alt="Склад готовой продукции" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </div>
          <span class="factory-caption">${uz?'Tayyor mahsulotlar ombori':'Логистический комплекс и склад'}</span>
        </div>
      </div>
    </section>

    <section class="about-certs-block">
      <h2>${uz?'Sertifikatlar va sifat kafolati':'Сертификаты и гарантия качества'}</h2>
      <p class="certs-desc">${uz?'Barcha mahsulotlar O‘zbekiston Respublikasi standartlariga va xalqaro ISO 9001 sifat talablariga to‘liq javob beradi.':'Вся производимая продукция сертифицирована в соответствии с национальными и международными стандартами качества ISO 9001:2015.'}</p>
      <div class="certs-grid">
        <div class="cert-card">
          <div class="cert-img-wrap" style="cursor:zoom-in;">
            <img src="assets/certificates/cert-iso-ru.png" alt="Сертификат соответствия ISO 9001:2015 TIC" loading="lazy" onerror="this.src='assets/certificates/certificates-all.png'">
          </div>
          <div class="cert-meta">
            <strong>${uz?'ISO 9001:2015 TIC (RU)':'Сертификат ISO 9001:2015 TIC'}</strong>
            <span>${uz?'Xalqaro sifat menejmenti tizimi sertifikati (TÜV Thüringen)':'Международный сертификат менеджмента качества TÜV Thüringen'}</span>
          </div>
        </div>

        <div class="cert-card">
          <div class="cert-img-wrap" style="cursor:zoom-in;">
            <img src="assets/certificates/cert-conformity-uz.png" alt="Sertifikat Muvofiqlik Milliy Tizimi" loading="lazy" onerror="this.src='assets/certificates/certificates-all.png'">
          </div>
          <div class="cert-meta">
            <strong>${uz?'Muvofiqlik sertifikati (UZ)':'Сертификат соответствия UZ'}</strong>
            <span>${uz?'O‘zbekiston Respublikasi Milliy sertifikatlashtirish tizimi (O‘zDSt ISO 9001:2015)':'Национальная система сертификации РУз (O‘z DSt ISO 9001:2015)'}</span>
          </div>
        </div>

        <div class="cert-card">
          <div class="cert-img-wrap" style="cursor:zoom-in;">
            <img src="assets/certificates/cert-iso-en.png" alt="Certificate ISO 9001:2015 TIC English" loading="lazy" onerror="this.src='assets/certificates/certificates-all.png'">
          </div>
          <div class="cert-meta">
            <strong>${uz?'Certificate ISO 9001:2015 (EN)':'Certificate ISO 9001:2015'}</strong>
            <span>${uz?'International Management System Certificate TIC':'International Management System Certificate TIC'}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="about-contacts-block">
      <h2>${uz?'Bosh ofis va aloqa ma’lumotlari':'Контакты головного офиса и завода'}</h2>
      <div class="about-contacts-grid">
        <div class="about-contact-card">
          <span class="about-contact-icon">📍</span>
          <div>
            <strong>${uz?'Manzilimiz':'Адрес производства'}</strong>
            <p>140134, ${uz?'Samarqand sh., Gagarin ko‘chasi, 36 (sobiq «KINAP» zavodi hududi)':'г. Самарканд, ул. Гагарина, 36 (территория з-да «КИНАП»)'}</p>
          </div>
        </div>
        <div class="about-contact-card">
          <span class="about-contact-icon">📞</span>
          <div>
            <strong>${uz?'Telefonlar':'Телефоны'}</strong>
            <p>+998 (93) 330-50-00 · +998 (93) 720-06-05</p>
          </div>
        </div>
        <div class="about-contact-card">
          <span class="about-contact-icon">✉️</span>
          <div>
            <strong>${uz?'Elektron pochta':'Электронная почта'}</strong>
            <p><a href="mailto:elxolding@bk.ru">elxolding@bk.ru</a></p>
          </div>
        </div>
        <div class="about-contact-card">
          <span class="about-contact-icon">🌐</span>
          <div>
            <strong>${uz?'Rasmiy veb-sayt':'Официальный сайт'}</strong>
            <p><a href="https://elxolding.uz" target="_blank" rel="noopener noreferrer">www.elxolding.uz ↗</a></p>
          </div>
        </div>
      </div>
    </div>

    <div class="about-footer-cta">
      <div>
        <h3>${uz?'ELXOLDING mahsulotlari bilan tanishing':'Ознакомьтесь с нашей продукцией'}</h3>
        <p>${uz?'Katalogimizda ta’lim uchun 1400 dan ortiq tayyor laboratoriya jihozlari va buyumlari mavjud.':'В нашем каталоге доступно более 1400 наименований сертифицированного учебно-лабораторного оборудования.'}</p>
      </div>
      <div class="about-cta-btns">
        <button class="primary" data-go="catalog">${t('catalog')}</button>
        <a class="telegram-link" href="https://elxolding.uz" target="_blank" rel="noopener noreferrer">${uz?'Rasmiy veb-sayt (elxolding.uz) ↗':'Официальный сайт (elxolding.uz) ↗'}</a>
      </div>
    </div>
  `;
  animateStats();
}

function animateStats(){
  const els = document.querySelectorAll('.stat-num[data-target]');
  els.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const isSpaced = el.getAttribute('data-format') === 'spaced';
    const duration = 1600;
    const start = performance.now();
    el.textContent = '0' + suffix;

    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * target);
      let formatted = isSpaced ? current.toLocaleString('ru-RU').replace(/,/g, ' ') : current.toString();
      el.textContent = formatted + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else {
        let finalVal = isSpaced ? target.toLocaleString('ru-RU').replace(/,/g, ' ') : target.toString();
        el.textContent = finalVal + suffix;
      }
    }
    requestAnimationFrame(step);
  });
}

$('#about-link').onclick=()=>go('about');$('#guide-link').onclick=()=>go('guide');$('#catalog-link').onclick=()=>go('catalog');$('.brand').onclick=e=>{e.preventDefault();go('catalog')};$('#cart-link').onclick=()=>go('cart');$('#product-dialog .close').onclick=()=>$('#product-dialog').close();$('#language').onchange=e=>{state.lang=e.target.value;try{localStorage.setItem('elx-client-language',JSON.stringify(state.lang))}catch{}render();if($('#product-dialog').open)detail($('#product-detail').dataset.id)};render();
