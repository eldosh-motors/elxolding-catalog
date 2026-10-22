'use strict';
Object.assign(words,{zoomPhoto:['Увеличить фотографию','Suratni kattalashtirish'],zoomIn:['Увеличить','Kattalashtirish'],zoomOut:['Уменьшить','Kichraytirish'],resetZoom:['По размеру окна','Oyna o‘lchamida'],zoomHint:['Колёсико — масштаб, перетаскивание — перемещение','G‘ildirak — masshtab, sudrash — siljitish']});
let zoomDialog,zoomState={scale:1,x:0,y:0,drag:null};
function openPhotoZoom(p){if(!p?.image)return;if(!zoomDialog){zoomDialog=document.createElement('dialog');zoomDialog.id='photo-zoom';document.body.append(zoomDialog)}zoomState={scale:1,x:0,y:0,drag:null};zoomDialog.innerHTML=`<div class="zoom-toolbar"><button type="button" id="zoom-minus" aria-label="${t('zoomOut')}">−</button><span id="zoom-value">100%</span><button type="button" id="zoom-plus" aria-label="${t('zoomIn')}">+</button><button type="button" id="zoom-fit">${t('resetZoom')}</button><button type="button" id="zoom-close" aria-label="${t('close')}">×</button></div><div id="zoom-stage" tabindex="0" aria-label="${t('zoomHint')}"><img id="zoom-image" src="${esc(photo(p,false))}" alt="${esc(field(p,'name'))}" draggable="false"></div><div class="zoom-caption">${esc(field(p,'name'))}<small>${t('zoomHint')}</small></div>`;
 const stage=$('#zoom-stage'),image=$('#zoom-image');
 function paint(){const fit=Math.min(stage.clientWidth/(image.naturalWidth||1),stage.clientHeight/(image.naturalHeight||1));const maxX=Math.max(0,((image.naturalWidth||0)*fit*zoomState.scale-stage.clientWidth)/2),maxY=Math.max(0,((image.naturalHeight||0)*fit*zoomState.scale-stage.clientHeight)/2);zoomState.x=Math.max(-maxX,Math.min(maxX,zoomState.x));zoomState.y=Math.max(-maxY,Math.min(maxY,zoomState.y));image.style.transform=`translate(${zoomState.x}px,${zoomState.y}px) scale(${zoomState.scale})`;$('#zoom-value').textContent=Math.round(zoomState.scale*100)+'%';stage.classList.toggle('magnified',zoomState.scale>1);$('#zoom-minus').disabled=zoomState.scale===1;$('#zoom-plus').disabled=zoomState.scale===6}
 function scale(next,cx=0,cy=0){const before=zoomState.scale;zoomState.scale=Math.max(1,Math.min(6,next));const ratio=zoomState.scale/before;zoomState.x=cx-(cx-zoomState.x)*ratio;zoomState.y=cy-(cy-zoomState.y)*ratio;paint()}
 $('#zoom-plus').onclick=()=>scale(zoomState.scale*1.25);$('#zoom-minus').onclick=()=>scale(zoomState.scale/1.25);$('#zoom-fit').onclick=()=>{zoomState.x=zoomState.y=0;scale(1)};$('#zoom-close').onclick=()=>zoomDialog.close();
 stage.addEventListener('wheel',e=>{e.preventDefault();const box=stage.getBoundingClientRect();scale(zoomState.scale*(e.deltaY<0?1.15:1/1.15),e.clientX-box.left-box.width/2,e.clientY-box.top-box.height/2)},{passive:false});
 stage.onpointerdown=e=>{if(e.button!==0)return;zoomState.drag={id:e.pointerId,x:e.clientX,y:e.clientY,px:zoomState.x,py:zoomState.y};stage.setPointerCapture(e.pointerId);stage.classList.add('dragging');e.preventDefault()};stage.onpointermove=e=>{const d=zoomState.drag;if(!d||d.id!==e.pointerId)return;zoomState.x=d.px+e.clientX-d.x;zoomState.y=d.py+e.clientY-d.y;paint()};function end(){zoomState.drag=null;stage.classList.remove('dragging')}stage.onpointerup=end;stage.onpointercancel=end;stage.onlostpointercapture=end;stage.ondblclick=()=>scale(zoomState.scale>1?1:2);
 stage.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','0'].includes(e.key)){e.preventDefault();if(e.key==='+')scale(zoomState.scale*1.25);else if(e.key==='-')scale(zoomState.scale/1.25);else if(e.key==='0')scale(1);else{zoomState.x+=e.key==='ArrowLeft'?40:e.key==='ArrowRight'?-40:0;zoomState.y+=e.key==='ArrowUp'?40:e.key==='ArrowDown'?-40:0;paint()}}};image.onload=paint;zoomDialog.showModal();paint();stage.focus()}
document.addEventListener('click',e=>{
  const detailImg=e.target.closest('#product-detail .detail img');
  if(detailImg){
    openPhotoZoom(byId.get($('#product-detail').dataset.id));
    return;
  }
  const cartThumbImg=e.target.closest('.cart-row-thumb img, .cart-row-thumb');
  if(cartThumbImg){
    const row=cartThumbImg.closest('.cart-row');
    const id=row?.dataset?.row;
    if(id){
      e.stopPropagation();
      openPhotoZoom(byId.get(id));
    }
  }
});
