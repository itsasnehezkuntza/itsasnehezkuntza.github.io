/* London Christmas Guide · v9 · claridad sin perder la temática.
   Cambios de presentación; reservas y documentación siguen guardadas solo en el dispositivo. */
(function(){
"use strict";
const FOCUS={
 "2026-12-06":{keys:["gatwick","farringdon","home"],notice:"Llegada por la noche: lo prioritario es llegar al apartamento antes del cierre del check-in."},
 "2026-12-07":{keys:["bridge","borough","garden"],notice:"Tower Bridge necesita entrada para el interior. Revisad su hora antes de salir."},
 "2026-12-08":{keys:["natural","carnaby","winter"],notice:"Winter Wonderland: entrad dentro de vuestra franja. Las atracciones no están incluidas en la entrada estándar."},
 "2026-12-09":{keys:["buckingham","covent","southbank"],notice:"El cambio de guardia depende del tiempo. El patinaje queda como actividad opcional."},
 "2026-12-10":{keys:["brick","spital","farringdon"],notice:"Una persona tiene vuelo esa tarde. Volved al apartamento con tiempo para recoger su equipaje."},
 "2026-12-11":{keys:["stalbans","stalbansmarket","camden"],notice:"La excursión a St Albans va en tren. Camden es opcional si os sobra tiempo."},
 "2026-12-12":{keys:["home","farringdon","gatwick"],notice:"Salid con margen hacia Gatwick y llevad las tarjetas de embarque descargadas."}
};
const ICON={
 gatwick:"✈️",home:"🏠",farringdon:"🚆",bridge:"🌉",borough:"🥨",
 garden:"🌇",natural:"🦖",carnaby:"✨",winter:"🎡",
 buckingham:"💂",covent:"🎄",southbank:"🎁",brick:"🎨",
 spital:"🛍️",stalbans:"⛪",stalbansmarket:"🎪",camden:"🧥"
};
const safe=s=>String(s??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
let renderedDay=null;
function getKeyStop(d,key){
 const idx=d.stops.findIndex(s=>s.place===key);
 if(idx<0)return null;
 return {stop:d.stops[idx],index:idx,key};
}
function entryStatus(s){
 if(!s?.id)return "";
 if(s.id==="skate")return "Opcional";
 if(!["science","natural","tower","winter"].includes(s.id))return "";
 const stateNow=bookingState(s.id);
 if(stateNow.status==="done")return "✓ Reservado";
 if(stateNow.status==="skip")return "Descartado";
 return ["science","natural"].includes(s.id)?"Reserva gratuita":"Entrada";
}
function highlights(d){
 const config=FOCUS[d.date]||{keys:[],notice:""};
 const chosen=config.keys.map(k=>getKeyStop(d,k)).filter(Boolean);
 const unique=new Set(chosen.map(item=>item.index));
 for(let i=0;i<d.stops.length&&chosen.length<3;i++){
  if(unique.has(i))continue;
  chosen.push({stop:d.stops[i],index:i,key:d.stops[i].place});unique.add(i);
 }
 return chosen.slice(0,3);
}
function renderFocus(d){
 const target=document.getElementById("day-focus");if(!target)return;
 const config=FOCUS[d.date]||{notice:""};
 const selected=highlights(d);
 const cards=selected.map(({stop,index,key},i)=>{
  const status=entryStatus(stop);
  const shownTime=stop.id&&["tower","science","natural","winter"].includes(stop.id)&&bookingState(stop.id).status==="done"?
    (bookingState(stop.id).time||stop.time):stop.time;
  return '<button class="focus-stop" type="button" data-stop="'+index+'" aria-label="Ver '+safe(stop.title)+' en el mapa">'+
   '<span class="focus-stop-icon" aria-hidden="true">'+(ICON[key]||d.emoji||"📍")+'</span>'+
   '<span class="focus-stop-copy"><small>'+safe(shownTime)+'</small><strong>'+safe(stop.title)+'</strong>'+
   (status?'<em class="focus-entry">'+safe(status)+'</em>':"")+'</span>'+
   '<span class="focus-stop-go" aria-hidden="true">↗</span></button>';
 }).join("");
 const notice=config.notice||"Revisad las horas de las entradas que ya tengáis confirmadas.";
 target.innerHTML='<section class="focus-paper">'+
 '<div class="focus-paper-top"><span class="focus-mini-stamp" aria-hidden="true"><span>LDN</span><b>✦</b><small>2026</small></span>'+
 '<div><div class="trip-section-label">01 <span>·</span> DE UN VISTAZO</div><h3>Lo esencial de hoy</h3></div>'+
 '<div class="focus-decor" aria-hidden="true">✳</div></div>'+
 '<div class="focus-stops" role="group" aria-label="Las paradas clave">'+cards+'</div>'+
 '<div class="focus-notice"><span aria-hidden="true">✦</span><span><strong>A tener en cuenta</strong> '+safe(notice)+'</span></div>'+
 '</section>';
 target.querySelectorAll(".focus-stop").forEach(btn=>btn.addEventListener("click",()=>{
  const n=Number(btn.dataset.stop);
  if(Number.isFinite(n)&&typeof window.focusStop==="function")window.focusStop(n+1);
 }));
}
function renderRoute(d){
 const anchor=document.getElementById("trip-main-route-link");if(!anchor)return;
 const legs=d.legs||[];
 const principal=legs.find(l=>l.mode==="walking"&&l.ids?.length>=3)||legs[0];
 if(!principal){anchor.hidden=true;return}
 const url=routeUrl(principal.ids,principal.mode);
 if(!url){anchor.hidden=true;return}
 anchor.hidden=false;anchor.href=url;
 anchor.innerHTML=(principal.mode==="transit"?"🚆 ":"↗ ")+"Abrir ruta principal en Google Maps";
 anchor.setAttribute("aria-label","Abrir en Google Maps: "+principal.label);
 const details=document.getElementById("trip-route-fold");
 if(details){
  details.hidden=legs.length<2;
  const summary=details.querySelector("summary");if(summary)summary.textContent="Ver rutas por tramos ("+legs.length+")";
 }
 const mini=document.getElementById("trip-times-intro");
 if(mini)mini.textContent=d.stops.length+" paradas previstas · La primera a las "+(d.stops[0]?.time||"—")+".";
 const fold=document.getElementById("trip-itinerary-fold");
 if(fold){const counter=fold.querySelector("summary span:first-child");if(counter)counter.textContent="Ver el itinerario completo ("+d.stops.length+" paradas)";}
}
function movePhotoGallery(){
 const holder=document.getElementById("trip-gallery-host");
 const gallery=document.getElementById("day-editorial");
 if(holder&&gallery&&gallery.parentNode!==holder)holder.appendChild(gallery);
 if(holder){
  const child=holder.querySelector(".editorial-gallery");
  const fold=document.getElementById("trip-gallery-fold");
  if(fold)fold.hidden=!child||!child.querySelector(".day-photo-item");
 }
}
function renderUI(){
 const d=DAYS[state.day]||DAYS[0];if(!d)return;
 const changed=d.date!==renderedDay;
 renderFocus(d);
 renderRoute(d);
 movePhotoGallery();
 if(changed){
  ["trip-itinerary-fold","trip-tips-fold","trip-gallery-fold","trip-route-fold"].forEach(id=>{
   const el=document.getElementById(id);if(el)el.open=false;
  });
  renderedDay=d.date;
 }
}
const previousRender=window.renderDay;
if(typeof previousRender!=="function")return;
window.renderDay=function(){previousRender();renderUI();};
renderUI();
})();