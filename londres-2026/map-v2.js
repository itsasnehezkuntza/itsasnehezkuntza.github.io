/* Londres 2026: mapas con iconos, flechas y fotos al tocar las paradas */
(function(){
"use strict";
const EMOJI={
gatwick:"✈️",home:"🏠",farringdon:"🚉",tower:"🏰",docks:"⛵",bridge:"🌉",
hays:"🏛️",borough:"🥙",monument:"🔥",dunstan:"🌿",garden:"🌇",leaden:"🛍️",
stpaul:"⛪",millennium:"🌉",science:"🔬",natural:"🦖",harrods:"🛍️",
piccadilly:"📺",fortnum:"🫖",carnaby:"🎄",hamleys:"🧸",oxford:"✨",winter:"🎢",
wellington:"💂",buckingham:"👑",stjames:"🌳",westminster:"⛪",bigben:"🕰️",
horseguards:"💂",trafalgar:"🎄",lego:"🧱",mm:"🍫",china:"🏮",neals:"🎨",
covent:"🎁",somerset:"⛸️",southbank:"🎄",columbia:"🌟",shoreditch:"🎨",
brick:"🎨",beigel:"🥯",spital:"🛍️",kings:"🚉",coaldrops:"🛍️",
platform:"🪄",stalbansstation:"🚉",stalbans:"⛪",stalbansclock:"🕰️",
stalbansmarket:"🧺",camden:"🛍️",greenwich:"⛵"
};
const WIKI={
gatwick:"Gatwick Airport",home:"Barbican Estate",farringdon:"Farringdon station",
tower:"Tower of London",docks:"St Katharine Docks",bridge:"Tower Bridge",
hays:"Hay's Galleria",borough:"Borough Market",monument:"Monument to the Great Fire of London",
dunstan:"St Dunstan-in-the-East",garden:"120 Fenchurch Street",
leaden:"Leadenhall Market",stpaul:"St Paul's Cathedral",millennium:"Millennium Bridge, London",
science:"Science Museum, London",natural:"Natural History Museum, London",harrods:"Harrods",
piccadilly:"Piccadilly Circus",fortnum:"Fortnum & Mason",carnaby:"Carnaby Street",
hamleys:"Hamleys",oxford:"Oxford Street",winter:"Winter Wonderland (Hyde Park)",
wellington:"Wellington Barracks",buckingham:"Buckingham Palace",stjames:"St James's Park",
westminster:"Westminster Abbey",bigben:"Big Ben",horseguards:"Horse Guards Parade",
trafalgar:"Trafalgar Square",lego:"Leicester Square",mm:"M&M's World",
china:"Chinatown, London",neals:"Neal's Yard",covent:"Covent Garden",somerset:"Somerset House",
southbank:"Southbank Centre",columbia:"Columbia Road Flower Market",shoreditch:"Shoreditch",
brick:"Brick Lane",beigel:"Beigel Bake",spital:"Old Spitalfields Market",
kings:"King's Cross railway station",coaldrops:"Coal Drops Yard",platform:"Platform 9¾",
stalbansstation:"St Albans City railway station",stalbans:"St Albans Cathedral",
stalbansclock:"Clock Tower, St Albans",stalbansmarket:"St Albans",
camden:"Camden Market",greenwich:"Greenwich Market"
};
/* Selección de fotografías reales, con fuente y autor en Wikimedia Commons. */
const COMMONS_PHOTOS={
 bridge:"Tower Bridge-London, England, United Kingdom.jpg",
 natural:"Natural History Museum, London, Dinosaur Gallery.jpg",
 hamleys:"Christmas lights in Regent Street, London, 2022.jpg",
 winter:"Rollercoaster at Winter Wonderland, Hyde Park, London - geograph.org.uk - 5229912.jpg",
 covent:"Covent Garden Christmas decorations 2025-12-09.jpg",
 stalbans:"St Albans Cathedral Exterior from west, Herfordshire, UK - Diliff.jpg",
};
function cleanCredit(raw){
 const el=document.createElement("div");el.innerHTML=String(raw||"").slice(0,2400);
 return (el.textContent||"").replace(/\\s+/g," ").trim().slice(0,85);
}
async function commonsPicture(key){
 const file=COMMONS_PHOTOS[key];if(!file)return null;
 const url="https://commons.wikimedia.org/w/api.php?origin=*&action=query&format=json&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=900&titles="+encodeURIComponent("File:"+file);
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7500);
 try {
  const r=await fetch(url,{signal:ctrl.signal,credentials:"omit"});
  if(!r.ok)return null;
  const data=await r.json();
  const info=Object.values(data.query?.pages||{})[0]?.imageinfo?.[0];if(!info)return null;
  const src=info.thumburl||info.url;
  if(!src||!src.startsWith("https://upload.wikimedia.org/"))return null;
  const meta=info.extmetadata||{};
  const author=cleanCredit(meta.Artist?.value).replace(/\\[.*?\\]/g,"")||"Wikimedia Commons";
  const license=cleanCredit(meta.LicenseShortName?.value)||"Licencia libre";
  return {src,page:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file.replaceAll(" ","_")),credit:author+" · "+license};
 }catch(e){return null}finally{clearTimeout(timer)}
}
const cache=new Map();
const sourceLink=key=>"https://en.wikipedia.org/wiki/"+encodeURIComponent((WIKI[key]||"London").replaceAll(" ","_"));
const pointLink=key=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((PLACE[key]||[51.51,-.12]).join(","));
async function getPicture(key){
 if(cache.has(key))return cache.get(key);
 const job=(async()=>{
  const cc=await commonsPicture(key);if(cc)return cc;
  const title=WIKI[key];if(!title)return null;
  const url="https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=720&pilicense=free&titles="+encodeURIComponent(title);
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);
  try{
   const resp=await fetch(url,{signal:ctrl.signal,credentials:"omit"});
   if(!resp.ok)return null;
   const data=await resp.json(),pages=Object.values(data.query?.pages||{}),thumb=pages[0]?.thumbnail?.source;
   if(typeof thumb!=="string"||!thumb.startsWith("https://upload.wikimedia.org/"))return null;
   return {src:thumb,page:sourceLink(key)};
  }catch(e){return null}finally{clearTimeout(timer)}
 })();
 cache.set(key,job);return job;
}
window.londonTripPhoto=getPicture;
let currentStops=[],markerMap=new Map(),selectedKey="";
const number=s=>String(s.num).padStart(2,"0");
function photoHtml(s,pic,small){
 return pic?
  '<img class="'+(small?"popup-img":"")+'" src="'+esc(pic.src)+'" alt="Fotografía de '+esc(s.title)+'" loading="lazy" referrerpolicy="no-referrer">':
  '<div class="'+(small?"popup-placeholder":"photo-placeholder")+'">'+(EMOJI[s.place]||"📍")+'</div>';
}
function bigCard(s,pic){
 return '<div class="map-photo-hero">'+photoHtml(s,pic,false)+'</div>'+
 '<div class="map-photo-body"><span class="label">PARADA '+number(s)+' · '+esc(s.time)+' · '+esc(s.duration)+'</span>'+
 '<h4>'+(EMOJI[s.place]||"📍")+' '+esc(s.title)+'</h4><p>'+esc(s.desc)+'</p>'+
 '<div class="map-photo-actions"><a href="'+pointLink(s.place)+'" target="_blank" rel="noopener">📍 Google Maps ↗</a>'+
 '<a href="'+(pic?esc(pic.page):sourceLink(s.place))+'" target="_blank" rel="noopener">'+(pic?"Fuente de la fotografía ↗":"Más información ↗")+'</a></div>'+(pic&&pic.credit?'<p class="photo-credit">Foto: '+esc(pic.credit)+'</p>':'')+'</div>';
}
function popupCard(s,pic){
 return '<div class="spot-popup">'+photoHtml(s,pic,true)+
 '<strong class="popup-title">'+number(s)+". "+esc(s.title)+'</strong>'+
 '<div class="popup-meta">'+esc(s.time)+' · '+esc(s.duration)+'</div>'+
 '<a href="'+pointLink(s.place)+'" target="_blank" rel="noopener">Cómo llegar ↗</a>'+
 (pic?' · <a href="'+esc(pic.page)+'" target="_blank" rel="noopener">Foto ↗</a>':"")+
 '</div>';
}
function ensureExtras(){
 const actions=document.getElementById("map-actions");if(!actions)return;
 if(!document.getElementById("map-legend")){
  const el=document.createElement("div");el.id="map-legend";el.className="map-legend";
  el.innerHTML='<span class="route-key"><i></i> A pie</span><span class="route-key transit"><i></i> Tren / trayecto largo</span>';
  actions.before(el);
 }
 if(!document.getElementById("map-stop-chips")){
  const el=document.createElement("div");el.id="map-stop-chips";el.className="map-stops";actions.before(el);
 }
 if(!document.getElementById("map-photo-card")){
  const el=document.createElement("div");el.id="map-photo-card";el.className="map-photo-card";
  document.querySelector(".map-under")?.after(el);
 }
 const explain=document.querySelector(".map-side .surface p.tiny");
 if(explain&&explain.textContent.includes("líneas discontinuas"))
  explain.textContent="Tocad los iconos numerados para ver una foto y los detalles de cada parada. Las líneas indican el orden orientativo, no las calles exactas; abrid Google Maps para navegar.";
}
function selectStop(s,zoomTo){
 if(!s)return;
 selectedKey=s.place;
 document.querySelectorAll(".map-stop-chip").forEach(e=>e.classList.toggle("active",e.dataset.place===s.place));
 document.querySelectorAll(".iconpin").forEach(e=>e.classList.toggle("active",e.dataset.place===s.place));
 const card=document.getElementById("map-photo-card");if(!card)return;
 card.innerHTML=bigCard(s,null);
 const m=markerMap.get(s.place);
 if(zoomTo&&m&&map&&typeof L!=="undefined"){
  map.panTo(m.getLatLng(),{animate:true,duration:.3});
  m.setPopupContent(popupCard(s,null));m.openPopup();
 }
 const date=DAYS[state.day]?.date;
 getPicture(s.place).then(pic=>{
  if(selectedKey!==s.place||date!==DAYS[state.day]?.date)return;
  card.innerHTML=bigCard(s,pic);
  const marker=markerMap.get(s.place);
  if(marker&&marker.isPopupOpen())marker.setPopupContent(popupCard(s,pic));
 });
}
window.focusStop=function(i){
 const d=DAYS[state.day],s=d?.stops[i-1];
 if(!s||!PLACE[s.place])return;
 selectStop(currentStops.find(x=>x.place===s.place)||{...s,num:i},true);
 document.querySelector(".map-side")?.scrollIntoView({behavior:"smooth",block:"start"});
};
function distanceKm(a,b){
 const r=Math.PI/180,x=(b[1]-a[1])*r*Math.cos((a[0]+b[0])*r/2)*6371,y=(b[0]-a[0])*r*6371;
 return Math.hypot(x,y);
}
function transit(d,a,b){
 if(distanceKm(a.coords,b.coords)>2.6)return true;
 return (d.legs||[]).some(l=>l.mode==="transit"&&l.ids.some((id,i)=>id===a.place&&l.ids[i+1]===b.place));
}
function arrow(a,b,isTrain){
 const lat=a.coords[0]+(b.coords[0]-a.coords[0])*.57,
 lng=a.coords[1]+(b.coords[1]-a.coords[1])*.57;
 const dy=b.coords[0]-a.coords[0],dx=(b.coords[1]-a.coords[1])*Math.cos(lat*Math.PI/180);
 const angle=-Math.atan2(dy,dx)*180/Math.PI;
 const icon=L.divIcon({className:"",html:'<span class="route-arrow'+(isTrain?" transit":"")+'" style="display:inline-block;transform:rotate('+angle+'deg)">➤</span>',iconSize:[16,16],iconAnchor:[8,8]});
 routeLines.push(L.marker([lat,lng],{icon,interactive:false,keyboard:false,zIndexOffset:-400}).addTo(map));
}
window.renderMap=function(d){
 ensureExtras();
 const actions=document.getElementById("map-actions"),legs=d.legs||[];
 actions.innerHTML=legs.map(l=>'<a class="small-btn" target="_blank" rel="noopener" href="'+routeUrl(l.ids,l.mode)+'">'+(l.mode==="transit"?"🚆":"🚶")+' '+esc(l.label)+' ↗</a>').join("");
 const seen=new Set();currentStops=[];
 d.stops.forEach((s,i)=>{
  if(!PLACE[s.place]||seen.has(s.place))return;
  seen.add(s.place);currentStops.push({...s,num:i+1,coords:PLACE[s.place]});
 });
 document.getElementById("map-stop-chips").innerHTML=currentStops.map(s=>
  '<button class="map-stop-chip" type="button" data-place="'+esc(s.place)+'" onclick="focusStop('+s.num+')" aria-label="Ver fotografía de '+esc(s.title)+'">'+
  number(s)+' '+(EMOJI[s.place]||"📍")+' <span>'+esc(s.title)+'</span></button>').join("");
 renderFallback(currentStops.map(s=>({place:s.place,title:s.title,lat:s.coords[0],lng:s.coords[1]})),d);
 markerMap.clear();
 if(typeof L==="undefined"){
  document.getElementById("map").hidden=true;
  document.getElementById("map-fallback").hidden=false;
  document.getElementById("map-status").textContent="Mapa esquemático. Usa los botones para abrir las calles en Google Maps.";
  selectStop(currentStops[0],false);return;
 }
 try{
  document.getElementById("map").hidden=false;document.getElementById("map-fallback").hidden=true;
  if(!map)map=L.map("map",{zoomControl:true,scrollWheelZoom:false,attributionControl:true});
  // OpenStreetMap standard tiles: no API key. Remove any obsolete CARTO layer.
  let hasOsm=false;
  map.eachLayer(layer=>{
   if(!(layer instanceof L.TileLayer))return;
   if(String(layer._url||"").includes("tile.openstreetmap.org"))hasOsm=true;
   else map.removeLayer(layer);
  });
  if(!hasOsm)L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  markers.forEach(m=>map.removeLayer(m));routeLines.forEach(l=>map.removeLayer(l));
  markers=[];routeLines=[];
  for(let i=0;i+1<currentStops.length;i++){
   const a=currentStops[i],b=currentStops[i+1],train=transit(d,a,b),coords=[a.coords,b.coords];
   routeLines.push(L.polyline(coords,{color:"#fff",weight:6,opacity:.9,interactive:false}).addTo(map));
   routeLines.push(L.polyline(coords,{color:train?"#8a9690":"#526f60",weight:3,opacity:.9,dashArray:train?"5 6":null,interactive:false}).addTo(map));
   arrow(a,b,train);
  }
  currentStops.forEach((s,i)=>{
   const cls=i===0?" first":i===currentStops.length-1?" last":"";
   const html='<div class="iconpin'+cls+'" data-place="'+esc(s.place)+'"><span class="symbol">'+(EMOJI[s.place]||"📍")+'</span><span class="counter">'+number(s)+'</span></div>';
   const icon=L.divIcon({className:"",html,iconSize:[48,51],iconAnchor:[23,26],popupAnchor:[0,-22]});
   const marker=L.marker(s.coords,{icon,title:s.title}).addTo(map).bindPopup(popupCard(s,null),{maxWidth:240,minWidth:205,autoPan:true});
   marker.on("click",()=>selectStop(s,false));
   markerMap.set(s.place,marker);markers.push(marker);
  });
  if(currentStops.length)map.fitBounds(currentStops.map(s=>s.coords),{padding:[48,48],maxZoom:14});
  setTimeout(()=>map&&map.invalidateSize(),150);
  document.getElementById("map-status").textContent="Orden orientativo con flechas. Pulsa «Google Maps» para ver el recorrido real por las calles.";
 }catch(e){
  document.getElementById("map").hidden=true;document.getElementById("map-fallback").hidden=false;
  document.getElementById("map-status").textContent="Mapa esquemático; abrid Google Maps para navegar.";
 }
 selectStop(currentStops[0],false);
};
const renderPrevious=window.renderDay;
window.renderDay=function(){
 renderPrevious();
 const d=DAYS[state.day];if(!d)return;
 document.querySelectorAll("#timeline .stop").forEach((row,i)=>{
  const stop=d.stops[i];if(!stop||!PLACE[stop.place])return;
  const label=row.querySelector(".stop-top > .tag");
  if(!label)return;
  const btn=document.createElement("button");
  btn.type="button";btn.className="stop-photo-button";
  btn.textContent=(EMOJI[stop.place]||"📍")+" "+(i+1)+" · Foto";
  btn.title="Ver fotografía y situación en el mapa";btn.onclick=()=>window.focusStop(i+1);
  label.replaceWith(btn);
 });
};
window.renderDay();
})();