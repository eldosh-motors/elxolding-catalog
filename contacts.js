'use strict';
// Public company contacts only. No desktop CRM or Telegram credentials are used.
Object.assign(words,{
 customer:['Ф. И. О.','F. I. Sh.'],city:['Адрес доставки','Yetkazib berish manzili'],
 organization:['Организация (необязательно)','Tashkilot (ixtiyoriy)'],email:['Электронная почта (необязательно)','Elektron pochta (ixtiyoriy)'],
 contactTitle:['Для обращений','Murojaat uchun'],addressTitle:['Наш адрес','Manzil'],
 address:['г. Самарканд, улица Гагарина, 36',"Samarqand sh. Gagarin ko‘chasi 36"],
 sendManager:['Отправить менеджеру','Menejerga yuborish'],
 prepareTitle:['Заявка подготовлена','So‘rov tayyorlandi'],
 telegramHelp:['Спецификация в формате Excel скачана на ваше устройство. Откройте Telegram, проверьте текст и прикрепите скачанный файл со всем списком товаров.','Excel formatidagi spetsifikatsiya qurilmangizga yuklab olindi. Telegramni oching, matnni tekshiring va yuklab olingan faylni biriktiring.'],
 openTelegram:['Открыть Telegram менеджера','Menejer Telegramini ochish'],copyRequest:['Скопировать всю заявку','To‘liq so‘rovni nusxalash'],
 copied:['Заявка скопирована','So‘rov nusxalandi'],copyFallback:['Выделите и скопируйте текст заявки.','So‘rov matnini belgilang va nusxalang.'],
 allItems:['Количество позиций','Mahsulot turlari soni'],
 fullFile:['Полный список товаров — в приложенном файле заявки.','Mahsulotlarning to‘liq ro‘yxati biriktirilgan so‘rov faylida.'],
 required:['Заполните Ф. И. О., телефон и адрес доставки.','F. I. Sh., telefon va yetkazib berish manzilini kiriting.'],invalidPhone:['Укажите корректный номер телефона.','To‘g‘ri telefon raqamini kiriting.'],
 hint:['Заполните контакты и нажмите «Отправить менеджеру». Заявка скачается файлом; отправьте её в открывшемся Telegram.','Kontaktlarni to‘ldiring va «Menejerga yuborish»ni bosing. So‘rov fayl sifatida yuklab olinadi; uni ochilgan Telegramda yuboring.']
});
state.customer.organization='';state.customer.email='';
const companyTelegram='https://t.me/NPOELXOLDING';
const companyInstagram='https://www.instagram.com/elxolding/';
const companyWebsite='https://elxolding.uz/';
const companyLocation='https://www.google.com/maps/place/ELXOLDING/@39.674017,66.934739,18z/data=!4m6!3m5!1s0x3f4d191024db16c5:0x1fea7e4da9a8531a!8m2!3d39.6740171!4d66.9347393!16s%2Fg%2F11g6z1qtr2?hl=ru&entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D';
function renderContacts(){
  const footer=$('#site-footer');
  if(!footer)return;
  footer.innerHTML=`
    <div class="footer-col footer-brand-col">
      <div class="footer-title">ELXOLDING SMART CATALOG</div>
      <p class="footer-desc">${state.lang==='uz'?'Ta’lim uchun jihozlar · 1988-yildan buyon ishonchli hamkor':'Оборудование для образования · Надежный производитель с 1988 года'}</p>
      <a class="contact-link web-link" href="${companyWebsite}" target="_blank" rel="noopener noreferrer">
        <span class="contact-ico web-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
        <span>elxolding.uz ↗</span>
      </a>
    </div>

    <div class="footer-col footer-contacts-col">
      <div class="footer-title">${t('contactTitle')}</div>
      <div class="footer-contacts-list">
        <a class="contact-link" href="tel:+998937200605"><span class="contact-ico phone-ico">📞</span><span>+998 93 720 06 05</span></a>
        <a class="contact-link" href="tel:+998933305000"><span class="contact-ico phone-ico">📞</span><span>+998 93 330 50 00</span></a>
        <a class="contact-link tg-link" href="${companyTelegram}" target="_blank" rel="noopener noreferrer">
          <span class="contact-ico tg-ico"><svg viewBox="0 0 24 24"><path d="m20.66 3.99-17.7 6.83c-1.21.49-1.2 1.16-.22 1.46l4.54 1.42 10.53-6.64c.5-.3.95-.14.58.19L9.86 15.02h-.01l-.31 4.67c.46 0 .66-.21.92-.46l2.2-2.14 4.58 3.38c.84.47 1.45.23 1.66-.78l3-14.15c.31-1.23-.47-1.78-1.24-1.55z"/></svg></span>
          <span>Telegram · @NPOELXOLDING ↗</span>
        </a>
        <a class="contact-link insta-link" href="${companyInstagram}" target="_blank" rel="noopener noreferrer">
          <span class="contact-ico insta-ico"><svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></span>
          <span>Instagram · @elxolding ↗</span>
        </a>
      </div>
    </div>

    <div class="footer-col footer-address-col">
      <div class="footer-title">${t('addressTitle')}</div>
      <div class="address-row">
        <span class="contact-ico address-ico">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </span>
        <span class="address-text">${esc(t('address'))}</span>
      </div>
      <a class="footer-map-link" href="${companyLocation}" target="_blank" rel="noopener noreferrer">
        <span class="map-link-ico"><svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg></span>
        <span>${state.lang==='uz'?'Google xaritada ko‘rish ↗':'Посмотреть на карте Google ↗'}</span>
      </a>
      <button class="primary send-manager-btn" data-go="cart">${t('sendManager')}</button>
    </div>
  `;
}
const renderBeforeContacts=render;
render=function(){renderBeforeContacts();renderContacts()};
const renderCartBeforeContacts=renderCart;
renderCart=function(){renderCartBeforeContacts();const form=$('#order-form');if(!form)return;
 const address=form.elements.city;address.required=true;address.previousSibling.textContent=t('city')+' *';
 for(const key of ['organization','email']){const label=document.createElement('label');label.innerHTML=`${t(key)}<input name="${key}" type="${key==='email'?'email':'text'}" maxlength="200" value="${esc(state.customer[key])}" autocomplete="${key==='email'?'email':'organization'}">`;form.insertBefore(label,form.elements.note.closest('label'))}
 const send=document.createElement('button');send.id='send-manager';send.type='button';send.className='primary telegram-button';send.textContent=t('sendManager');send.onclick=prepareTelegram;
 form.insertBefore(send,form.querySelector('[type="submit"]'));form.querySelector('[type="submit"]').className='download-secondary';
 form.elements.name.autocomplete='name';form.elements.phone.autocomplete='tel';
 const previousInput=form.oninput;form.oninput=e=>{e.target.setCustomValidity?.('');previousInput(e)};
};
function validRequest(){const form=$('#order-form');if(!form||!form.reportValidity())return false;for(const key of ['name','phone','city'])if(!state.customer[key].trim()){form.elements[key].focus();toast(t('required'));return false}if(state.customer.phone.replace(/\D/g,'').length<7){form.elements.phone.setCustomValidity(t('invalidPhone'));form.elements.phone.reportValidity();return false}return state.cart.length>0}
function completeRequest(){const o=order();const lines=['ELXOLDING — '+t('request'),`${t('date')}: ${o.display}`];
 for(const [key,label] of [['name','customer'],['phone','phone'],['city','city'],['organization','organization'],['email','email'],['note','note']])if(state.customer[key])lines.push(`${t(label)}: ${state.customer[key]}`);
 lines.push('');for(const [n,item] of o.items.entries())lines.push(`${n+1}. ${item.name}`,`${t('article')}: ${item.id} | ${t('unit')}: ${item.unit} | ${t('quantity')}: ${item.quantity}`,`${t('price')}: ${item.price===null?t('unknown'):money(item.price)+' '+t('currency')} | ${t('sum')}: ${item.sum===null?t('unknown'):money(item.sum)+' '+t('currency')}`,'');
 lines.push(`${t('allItems')}: ${o.items.length}`,`${t('total')}: ${money(amount())} ${t('currency')}`);if(hasUnknown())lines.push(t('unknownNote'));lines.push(t('notConfirmed'),'','ELXOLDING',companyTelegram,companyInstagram,'+998 93 720 06 05 / +998 93 330 50 00',t('address'));return {text:lines.join('\r\n'),order:o}}
function prepareTelegram(){if(!validRequest())return;const o=order();const xmlContent=generateExcelXml(o);download(xmlContent,'application/vnd.ms-excel;charset=utf-8',`ELXOLDING_${state.lang==='uz'?'Spetsifikatsiya':'Спецификация'}_${o.stamp}.xls`);
 const request=completeRequest();
 let draft=request.text;if(draft.length>1200)draft=['ELXOLDING — '+t('request'),`${t('date')}: ${request.order.display}`,`${t('customer')}: ${state.customer.name}`,`${t('phone')}: ${state.customer.phone}`,`${t('city')}: ${state.customer.city}`,`${t('allItems')}: ${request.order.items.length}`,`${t('total')}: ${money(amount())} ${t('currency')}`,t('fullFile')].join('\n');
 let dialog=$('#telegram-request');if(!dialog){dialog=document.createElement('dialog');dialog.id='telegram-request';document.body.append(dialog)}
 dialog.innerHTML=`<button class="close" type="button" aria-label="${t('close')}">×</button><h2>${t('prepareTitle')}</h2><p class="notice">${t('telegramHelp')}</p><textarea id="telegram-request-text" readonly aria-label="${t('request')}">${esc(request.text)}</textarea><div class="telegram-actions"><a id="open-manager" class="telegram-link" href="${companyTelegram}?text=${encodeURIComponent(draft)}" target="_blank" rel="noopener noreferrer">${t('openTelegram')} ↗</a><button id="copy-request" type="button">${t('copyRequest')}</button></div><p class="notice">${t('contactTitle')}: <a href="tel:+998937200605">+998 93 720 06 05</a> · <a href="tel:+998933305000">+998 93 330 50 00</a></p>`;
 dialog.querySelector('.close').onclick=()=>dialog.close();$('#copy-request').onclick=async()=>{try{if(!navigator.clipboard)throw Error('clipboard unavailable');await navigator.clipboard.writeText(request.text);toast(t('copied'))}catch{const text=$('#telegram-request-text');text.focus();text.select();let copied=false;try{copied=document.execCommand('copy')}catch{}toast(copied?t('copied'):t('copyFallback'))}};dialog.showModal();
}
render();
