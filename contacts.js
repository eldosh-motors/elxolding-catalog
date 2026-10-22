'use strict';
// Public company contacts only. No desktop CRM or Telegram credentials are used.
Object.assign(words,{
 customer:['Ф. И. О.','F. I. Sh.'],city:['Адрес доставки','Yetkazib berish manzili'],
 organization:['Организация (необязательно)','Tashkilot (ixtiyoriy)'],email:['Электронная почта (необязательно)','Elektron pochta (ixtiyoriy)'],
 contactTitle:['Для обращений','Murojaat uchun'],addressTitle:['Наш адрес','Manzil'],
 address:['г. Самарканд, улица Гагарина, 36',"Samarqand sh. Gagarin ko‘chasi 36"],
 sendManager:['Отправить менеджеру','Menejerga yuborish'],
 prepareTitle:['Заявка подготовлена','So‘rov tayyorlandi'],
 telegramHelp:['Полная заявка скачана на ваше устройство. Откройте Telegram, проверьте текст и нажмите «Отправить». Прикрепите скачанный файл со всем списком товаров.','To‘liq so‘rov qurilmangizga yuklab olindi. Telegramni oching, matnni tekshiring va «Yuborish»ni bosing. Barcha mahsulotlar ro‘yxati bor yuklab olingan faylni biriktiring.'],
 openTelegram:['Открыть Telegram менеджера','Menejer Telegramini ochish'],copyRequest:['Скопировать всю заявку','To‘liq so‘rovni nusxalash'],
 copied:['Заявка скопирована','So‘rov nusxalandi'],copyFallback:['Выделите и скопируйте текст заявки.','So‘rov matnini belgilang va nusxalang.'],
 allItems:['Количество позиций','Mahsulot turlari soni'],
 fullFile:['Полный список товаров — в приложенном файле заявки.','Mahsulotlarning to‘liq ro‘yxati biriktirilgan so‘rov faylida.'],
 required:['Заполните Ф. И. О., телефон и адрес доставки.','F. I. Sh., telefon va yetkazib berish manzilini kiriting.'],invalidPhone:['Укажите корректный номер телефона.','To‘g‘ri telefon raqamini kiriting.'],
 hint:['Заполните контакты и нажмите «Отправить менеджеру». Заявка скачается файлом; отправьте её в открывшемся Telegram.','Kontaktlarni to‘ldiring va «Menejerga yuborish»ni bosing. So‘rov fayl sifatida yuklab olinadi; uni ochilgan Telegramda yuboring.']
});
state.customer.organization='';state.customer.email='';
const companyTelegram='https://t.me/NPOELXOLDING';
function renderContacts(){const footer=$('#site-footer');if(!footer)return;footer.innerHTML=`<div class="footer-company"><strong>ELXOLDING SMART CATALOG</strong><p>${state.lang==='uz'?'Ta’lim uchun jihozlar':'Оборудование для образования'}</p></div><div class="footer-contacts"><strong>${t('contactTitle')}</strong><a href="tel:+998937200605">+998 93 720 06 05</a><a href="tel:+998933305000">+998 93 330 50 00</a><a href="${companyTelegram}" target="_blank" rel="noopener noreferrer">Telegram · @NPOELXOLDING ↗</a></div><div class="footer-address"><strong>${t('addressTitle')}</strong><p>${esc(t('address'))}</p><button class="primary" data-go="cart">${t('sendManager')}</button></div>`}
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
 lines.push(`${t('allItems')}: ${o.items.length}`,`${t('total')}: ${money(amount())} ${t('currency')}`);if(hasUnknown())lines.push(t('unknownNote'));lines.push(t('notConfirmed'),'','ELXOLDING',companyTelegram,'+998 93 720 06 05 / +998 93 330 50 00',t('address'));return {text:lines.join('\r\n'),order:o}}
function prepareTelegram(){if(!validRequest())return;const request=completeRequest();download(request.text,'text/plain;charset=utf-8',`ELXOLDING_${state.lang==='uz'?'Sorov':'Заявка'}_${request.order.stamp}.txt`);
 let draft=request.text;if(draft.length>1200)draft=['ELXOLDING — '+t('request'),`${t('date')}: ${request.order.display}`,`${t('customer')}: ${state.customer.name}`,`${t('phone')}: ${state.customer.phone}`,`${t('city')}: ${state.customer.city}`,`${t('allItems')}: ${request.order.items.length}`,`${t('total')}: ${money(amount())} ${t('currency')}`,t('fullFile')].join('\n');
 let dialog=$('#telegram-request');if(!dialog){dialog=document.createElement('dialog');dialog.id='telegram-request';document.body.append(dialog)}
 dialog.innerHTML=`<button class="close" type="button" aria-label="${t('close')}">×</button><h2>${t('prepareTitle')}</h2><p class="notice">${t('telegramHelp')}</p><textarea id="telegram-request-text" readonly aria-label="${t('request')}">${esc(request.text)}</textarea><div class="telegram-actions"><a id="open-manager" class="telegram-link" href="${companyTelegram}?text=${encodeURIComponent(draft)}" target="_blank" rel="noopener noreferrer">${t('openTelegram')} ↗</a><button id="copy-request" type="button">${t('copyRequest')}</button></div><p class="notice">${t('contactTitle')}: <a href="tel:+998937200605">+998 93 720 06 05</a> · <a href="tel:+998933305000">+998 93 330 50 00</a></p>`;
 dialog.querySelector('.close').onclick=()=>dialog.close();$('#copy-request').onclick=async()=>{try{if(!navigator.clipboard)throw Error('clipboard unavailable');await navigator.clipboard.writeText(request.text);toast(t('copied'))}catch{const text=$('#telegram-request-text');text.focus();text.select();let copied=false;try{copied=document.execCommand('copy')}catch{}toast(copied?t('copied'):t('copyFallback'))}};dialog.showModal();
}
render();
