'use strict';
words.hero=['Оснащаем образование будущего','Kelajak ta’limini jihozlaymiz'];
words.intro=['Современное учебное и лабораторное оборудование для школ, колледжей, университетов и образовательных центров.','Maktablar, kollejlar, universitetlar va ta’lim markazlari uchun zamonaviy o‘quv va laboratoriya jihozlari.'];
const updateNavBeforeIcons=updateNav;
updateNav=function(){updateNavBeforeIcons();$('#cart-link').innerHTML=cartSVG+`<span>${t('cart')} · ${state.cart.length}</span>`};
const renderResultsBeforeTable=renderResults;
renderResults=function(){renderResultsBeforeTable();if(state.view!=='list')return;const grid=$('#results .grid');if(!grid)return;const ids=[...grid.querySelectorAll('[data-add]')].map(button=>button.dataset.add);const container=document.createElement('div');container.className='customer-table-wrap';container.innerHTML=`<table class="customer-table"><thead><tr><th>${t('photo')}</th><th>${t('product')}</th><th>${t('price')}</th><th></th></tr></thead><tbody>${ids.map(id=>{const p=byId.get(id);return `<tr><td><button class="table-photo" data-detail="${esc(id)}" aria-label="${t('details')}">${image(p)}</button></td><td><button class="table-title" data-detail="${esc(id)}">${esc(field(p,'name'))}</button><small>${t('article')}: ${esc(id)} · ${esc(field(p,'unit'))}</small><small>${esc(field(p,'direction'))}</small></td><td class="table-price">${price(p)}</td><td><button class="primary" data-add="${esc(id)}" aria-label="${t('add')}" title="${t('add')}">${cartSVG}</button></td></tr>`}).join('')}</tbody></table>`;grid.replaceWith(container)};
const iconsMap={
  all:`<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
  'Без категории':`<svg viewBox="0 0 24 24"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
  'Биология':`<svg viewBox="0 0 24 24"><path d="M7 20h10"/><path d="M10 20c0-4.4 3.6-8 8-8v-1a7 7 0 0 0-14 0v1c4.4 0 8 3.6 8 8Z"/><path d="M12 12V3"/></svg>`,
  'Дошкольное образование':`<svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><line x1="3" y1="9" x2="21" y2="9"/></svg>`,
  'Естествознание':`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  'Начальные классы':`<svg viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
  'НДП':`<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  'Оборудование общего пользования':`<svg viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><line x1="12" y1="12" x2="12" y2="12"/></svg>`,
  'Физика':`<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/><circle cx="12" cy="12" r="2"/></svg>`,
  'Химия':`<svg viewBox="0 0 24 24"><path d="M10 2v7.31L4.1 20.08A2 2 0 0 0 5.82 23h12.36a2 2 0 0 0 1.72-2.92L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`
};

function getDirectionIcon(name){
  if(!name)return iconsMap.all;
  for(const key of Object.keys(iconsMap)){
    if(key.toLowerCase()===name.trim().toLowerCase()) return iconsMap[key];
  }
  return iconsMap['Без категории'];
}

function directionButtons(){
  const select=$('#direction');
  if(!select)return;
  select.hidden=true;
  
  let layout=$('.catalog-layout');
  if(!layout){
    const tools=$('.tools');
    const displayOptions=$('#display-options');
    const results=$('#results');
    
    layout=document.createElement('div');
    layout.className='catalog-layout';
    
    const sidebar=document.createElement('aside');
    sidebar.className='catalog-sidebar';
    sidebar.id='catalog-sidebar';
    
    const content=document.createElement('div');
    content.className='catalog-content';
    
    tools.parentNode.insertBefore(layout,tools);
    layout.append(sidebar,content);
    content.append(tools,displayOptions,results);
  }
  
  const sidebar=$('#catalog-sidebar');
  const dirs=[...select.options];
  const allCount=products.length;
  
  sidebar.innerHTML=`
    <div class="sidebar-title">${state.lang==='uz'?'Yo‘nalishlar':'Направления'}</div>
    <nav class="category-nav">
      ${dirs.map(option=>{
        const val=option.value;
        const count=val?products.filter(p=>p.direction===val).length:allCount;
        const active=val===state.direction;
        const iconSvg=getDirectionIcon(val);
        return `<button type="button" data-direction="${esc(val)}" class="category-item ${active?'active':''}" aria-pressed="${active}">
          <span class="category-icon">${iconSvg}</span>
          <span class="category-name">${esc(option.textContent)}</span>
          <span class="category-badge">${count}</span>
        </button>`;
      }).join('')}
    </nav>
  `;
  
  sidebar.onclick=e=>{
    const button=e.target.closest('[data-direction]');
    if(!button)return;
    state.direction=button.dataset.direction;
    state.pageNo=1;
    select.value=state.direction;
    sidebar.querySelectorAll('.category-item').forEach(el=>{
      const active=el.dataset.direction===state.direction;
      el.classList.toggle('active',active);
      el.setAttribute('aria-pressed',String(active));
    });
    renderResults();
  };
}

const renderCatalogBeforeButtons=renderCatalog;
renderCatalog=function(){
  renderCatalogBeforeButtons();
  directionButtons();
};
render();
