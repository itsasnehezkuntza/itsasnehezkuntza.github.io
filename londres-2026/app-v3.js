/* Londres 2026 · utilidades v3. La URL de Drive nunca se publica en el repositorio. */
(function(){
"use strict";
const KEY="london2026_private_drive_link";
function validateDrive(text){
  try{
    const url=new URL(text.trim());
    if(url.protocol!=="https:"||url.hostname!=="drive.google.com")return "";
    if(!/^\/drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]{12,}\/?$/.test(url.pathname))return "";
    return url.origin+url.pathname;
  }catch(e){return ""}
}
function setDriveStatus(message){
  const box=document.getElementById("private-drive-status");
  if(box)box.textContent=message;
}
function storedDrive(){return validateDrive(localStorage.getItem(KEY)||"")}
window.savePrivateDrive=function(){
  const input=document.getElementById("private-drive-input");
  const candidate=validateDrive(input?.value||"");
  if(!candidate){setDriveStatus("Pegad un enlace válido a una carpeta de Google Drive.");return}
  localStorage.setItem(KEY,candidate);
  refreshDrivePanel();
  setDriveStatus("Enlace guardado solo en este navegador. Verificad que Drive esté en Acceso restringido.");
};
window.forgetPrivateDrive=function(){
  localStorage.removeItem(KEY);
  refreshDrivePanel();
  setDriveStatus("Se ha quitado el enlace guardado de este dispositivo.");
};
window.openPrivateDrive=function(){
  const link=storedDrive();
  if(link){window.open(link,"_blank","noopener,noreferrer");return}
  switchTab("files");
  document.getElementById("private-drive-input")?.focus();
  document.getElementById("private-drive-panel")?.scrollIntoView({behavior:"smooth",block:"start"});
};
function refreshDrivePanel(){
  const input=document.getElementById("private-drive-input"),link=storedDrive();
  if(input)input.value=link;
  const open=document.getElementById("private-drive-open");
  if(open){open.hidden=!link;open.href=link||"#"}
  const deleteButton=document.getElementById("private-drive-forget");
  if(deleteButton)deleteButton.hidden=!link;
}
function setupPrivateDrive(){
  const view=document.getElementById("files-view");
  if(!view||document.getElementById("private-drive-panel"))return;
  const html=document.createElement("section");
  html.id="private-drive-panel";
  html.className="private-drive-panel";
  html.innerHTML=
  '<div class="private-kicker">DOCUMENTACIÓN PRIVADA</div>'+
  '<h3>📁 Vuestra carpeta de Google Drive</h3>'+
  '<p>Los billetes y las confirmaciones deben permanecer en Drive, con permiso solo para las tres personas. Aquí podéis guardar un acceso rápido sin publicar la URL en GitHub.</p>'+
  '<label for="private-drive-input">Enlace privado de la carpeta</label>'+
  '<input id="private-drive-input" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Pega aquí el enlace de Drive" />'+
  '<div class="private-actions"><button class="primary-btn" type="button" onclick="savePrivateDrive()">Guardar en este móvil</button>'+
  '<a class="small-btn" id="private-drive-open" href="#" target="_blank" rel="noopener noreferrer" hidden>📂 Abrir Drive ↗</a>'+
  '<button class="small-btn" id="private-drive-forget" type="button" onclick="forgetPrivateDrive()" hidden>Quitar enlace</button></div>'+
  '<div class="private-warning">🔒 Importante: Drive debe tener «Acceso general → Restringido» y cada uno de vosotros acceso individual. Actualmente la carpeta tenía activado «Cualquiera con el enlace». Guardar aquí el enlace NO modifica esos permisos.</div>'+
  '<p id="private-drive-status" role="status"></p>';
  const firstHelp=view.querySelector(".help-card");
  if(firstHelp)firstHelp.before(html);else view.prepend(html);
  refreshDrivePanel();
  const hero=document.querySelector(".top-actions");
  if(hero&&!document.getElementById("hero-drive-link")){
    const btn=document.createElement("button");
    btn.type="button";btn.className="hero-btn";btn.id="hero-drive-link";
    btn.textContent="📁 Drive privado";
    btn.onclick=()=>window.openPrivateDrive();
    hero.append(btn);
  }
}
let expanded=false;
window.toggleFullMap=function(){
  expanded=!expanded;
  document.body.classList.toggle("map-expanded",expanded);
  const b=document.getElementById("expand-map");
  if(b)b.textContent=expanded?"✕ Cerrar mapa":"⛶ Ampliar mapa";
  setTimeout(()=>{try{map?.invalidateSize()}catch(e){}},170);
};
window.centerDayMap=function(){
  try{
    const points=[],seen=new Set();
    for(const stop of DAYS[state.day]?.stops||[]){
      if(!stop.place||seen.has(stop.place)||!PLACE[stop.place])continue;
      points.push(PLACE[stop.place]);seen.add(stop.place);
    }
    if(map&&typeof L!=="undefined"&&points.length)map.fitBounds(points,{padding:[46,46],maxZoom:14});
  }catch(e){}
};
window.nextDayStop=function(){
  const list=[];
  for(const s of DAYS[state.day]?.stops||[]){
    if(s.place&&PLACE[s.place]&&!list.includes(s.place))list.push(s.place);
  }
  if(!list.length)return;
  const opened=map&&typeof L!=="undefined"?map.getCenter():null;
  let current=-1;
  const active=document.querySelector(".map-stop-chip.active");
  if(active)current=list.indexOf(active.dataset.place);
  const next=list[(current+1)%list.length];
  const index=DAYS[state.day].stops.findIndex(s=>s.place===next);
  if(index>=0)window.focusStop(index+1);
};
function setupMapTools(){
  const row=document.querySelector(".map-under");
  if(!row||document.getElementById("map-tools"))return;
  const tools=document.createElement("div");
  tools.className="map-tools";tools.id="map-tools";
  tools.innerHTML=
    '<span class="tiny muted">Toca una parada para ver foto y detalles</span>'+
    '<div class="private-actions" style="display:flex;gap:6px;flex-wrap:wrap">'+
    '<button type="button" class="map-tool-btn" onclick="nextDayStop()">Siguiente →</button>'+
    '<button type="button" class="map-tool-btn" onclick="centerDayMap()">Ver todas</button>'+
    '<button type="button" id="expand-map" class="map-tool-btn" onclick="toggleFullMap()">⛶ Ampliar mapa</button></div>';
  row.before(tools);
}
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&expanded)window.toggleFullMap();
});
setupPrivateDrive();
setupMapTools();
})();