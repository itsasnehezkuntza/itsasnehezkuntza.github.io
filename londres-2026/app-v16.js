/* LA PATRULLA POLAR · Edición Londres 2026
   Funciones nuevas: maleta real y sobres de tickets. Se guardan dentro del
   estado local que ya exporta/importa la aplicación.
   No existe ningún "código compartido" falso ni se envían documentos a terceros. */
(function(){
"use strict";
const PACKING=[
 {group:"Imprescindibles",kind:"personal",items:[
  ["passport","Pasaporte"],["eta","ETA o permiso de entrada"],["cards","Tarjeta bancaria"],["student","Carnet de estudiante"],["wallet","Cartera y documentación"],["medication","Medicinas personales"]]},
 {group:"Ropa de invierno",kind:"personal",items:[
  ["coat","Abrigo impermeable"],["warmshirt","Jerséis o sudaderas"],["trousers","Pantalones"],["socks","Calcetines de abrigo"],["underwear","Ropa interior"],["shoes","Calzado cómodo"],["scarf","Bufanda y guantes"],["pajamas","Pijama"],["extra","Cambio de ropa"]]},
 {group:"Tecnología y aseo",kind:"personal",items:[
  ["phone","Móvil"],["charger","Cargador"],["powerbank","Batería externa"],["adapter","Adaptador británico tipo G"],["headphones","Auriculares"],["toiletries","Neceser"],["toothbrush","Cepillo de dientes"]]},
 {group:"Para llevar entre los tres",kind:"shared",items:[
  ["tickets","Acceso a los tickets originales"],["apartment","Instrucciones de acceso al apartamento"],["umbrella","Paraguas plegable"],["firstaid","Mini botiquín"],["groupadapter","Adaptador de repuesto"],["groupplans","Mapa y horarios sin conexión"]]}
];
const FILTERS=["all","personal","shared"];
let currentFilter="all";
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function ensurePacking(){
 if(!state.packing||typeof state.packing!=="object"||Array.isArray(state.packing))state.packing={};
 if(!Array.isArray(state.packingExtra))state.packingExtra=[];
}
function entries(){
 const all=[];
 for(const section of PACKING)for(const [id,label] of section.items)all.push({
  id, label,group:section.group,kind:section.kind,custom:false
 });
 for(const item of state.packingExtra){
  if(!item||typeof item.id!=="string"||typeof item.label!=="string")continue;
  all.push({id:item.id,label:item.label.slice(0,70),group:"Añadido por nosotros",kind:item.kind==="shared"?"shared":"personal",custom:true});
 }
 return all;
}
function renderPacking(){
 const host=document.getElementById("packing-list");
 if(!host)return;
 ensurePacking();
 const all=entries(),seen=all.filter(item=>currentFilter==="all"||item.kind===currentFilter);
 const checkedCount=all.filter(x=>!!state.packing[x.id]).length;
 const counter=document.getElementById("packing-count");
 if(counter)counter.textContent=checkedCount+"/"+all.length;
 for(const btn of document.querySelectorAll("[data-packing-filter]")){
  const active=btn.dataset.packingFilter===currentFilter;
  btn.classList.toggle("pp-packing-filter-on",active);
  btn.setAttribute("aria-pressed",active?"true":"false");
 }
 const groups=[...new Set(seen.map(x=>x.group))];
 host.innerHTML=groups.length?groups.map(g=>{
  const rows=seen.filter(x=>x.group===g);
  return '<section class="pp-packing-group"><h4>'+safe(g)+'</h4><div class="pp-packing-items">'+rows.map(x=>{
   const checked=!!state.packing[x.id];
   return '<div class="pp-packing-custom"><label class="pp-packing-item '+(checked?'pp-packing-checked':'')+'">'+
    '<input type="checkbox" data-pack-id="'+safe(x.id)+'" '+(checked?'checked':'')+'>'+
    '<span>'+safe(x.label)+'</span></label>'+
    (x.custom?'<button type="button" data-pack-remove="'+safe(x.id)+'" title="Quitar de la lista" aria-label="Eliminar '+safe(x.label)+'">×</button>':'')+
    '</div>';
  }).join("")+'</div></section>';
 }).join(""):'<p class="tiny muted">Aún no hay elementos en esta categoría.</p>';
}
function addPacking(){
 const input=document.getElementById("packing-custom-input");if(!input)return;
 const text=input.value.trim().replace(/\s+/g," ");
 if(!text)return;
 if(text.length>70){input.focus();return}
 ensurePacking();
 if(state.packingExtra.length>=50){toast("La lista adicional ya tiene 50 elementos.");return}
 const id="extra-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6);
 state.packingExtra.push({id,label:text,kind:currentFilter==="shared"?"shared":"personal"});
 input.value="";
 save();renderPacking();input.focus();
}
function bindPackingEvents(){
 const host=document.getElementById("packing-board");
 if(!host)return;
 host.addEventListener("change",e=>{
  const checkbox=e.target.closest("[data-pack-id]");
  if(!checkbox)return;
  ensurePacking();state.packing[checkbox.dataset.packId]=!!checkbox.checked;
  save();renderPacking();
 });
 host.addEventListener("click",e=>{
  const filter=e.target.closest("[data-packing-filter]");
  if(filter&&FILTERS.includes(filter.dataset.packingFilter)){
   currentFilter=filter.dataset.packingFilter;renderPacking();return;
  }
  const del=e.target.closest("[data-pack-remove]");
  if(del){
   ensurePacking();
   state.packingExtra=state.packingExtra.filter(x=>x.id!==del.dataset.packRemove);
   delete state.packing[del.dataset.packRemove];save();renderPacking();
  }
 });
 document.getElementById("packing-add-btn")?.addEventListener("click",addPacking);
 document.getElementById("packing-custom-input")?.addEventListener("keydown",e=>{
  if(e.key==="Enter"){e.preventDefault();addPacking()}
 });
}
const CARD_SET=[
 {id:"tower",symbol:"🌉",hint:"LUN 07 · 10:30",title:"Tower Bridge"},
 {id:"natural",symbol:"🦖",hint:"MAR 08 · 11:15",title:"Natural History Museum"},
 {id:"winter",symbol:"🎡",hint:"MAR 08 · 17:00",title:"Winter Wonderland"},
 {id:"skate",symbol:"⛸️",hint:"MIÉ 09 · 21:00",title:"Somerset House"},
 {id:"flight",symbol:"✈",hint:"VUELOS · 06 / 10 / 12",title:"Vuelos y embarques"},
 {id:"lodging",symbol:"🏠",hint:"06–12 DIC",title:"Apartamento"}
];
function fileForBooking(id){
 const validCats=id==="flight"?["flight","flights"]:id==="lodging"?["lodging"]: [id];
 return files.find(f=>validCats.includes(f.cat));
}
function renderTicketCollection(){
 const host=document.getElementById("ticket-collection");if(!host)return;
 const cards=CARD_SET.map((c,i)=>{
  const b=BOOK.find(b=>b.id===c.id),bs=b?bookingState(c.id):null;
  const file=fileForBooking(c.id);
  const status=bs?.status==="done"?"✓ Reservado":bs?.status==="skip"?"No se hace":"Por comprobar";
  const action=file?'<button type="button" data-open-local="'+safe(file.id)+'">Ver documento ↗</button>':
   '<button type="button" data-open-drive>Carpeta privada ↗</button>';
  return '<article class="pp-ticket-stamp">'+
   '<span aria-hidden="true">'+c.symbol+'</span>'+
   '<div class="pp-ticket-stamp-copy"><small>'+safe(c.hint)+'</small><strong>'+safe(c.title)+'</strong>'+
   '<em>'+safe(status)+'</em>'+action+'</div></article>';
 }).join("");
 host.innerHTML='<div class="pp-ticket-collection-head"><div><small>COLECCIÓN DE ENTRADAS</small><h3>Los sellos del viaje</h3></div><span class="tiny muted">Toca para abrir</span></div>'+
 '<div class="pp-ticket-collection-grid">'+cards+'</div>';
}
function bindTickets(){
 const host=document.getElementById("ticket-collection");if(!host)return;
 host.addEventListener("click",e=>{
  const fileButton=e.target.closest("[data-open-local]");
  if(fileButton){openFile(fileButton.dataset.openLocal);return}
  if(e.target.closest("[data-open-drive]")){
   if(typeof window.openPrivateDrive==="function")window.openPrivateDrive();
   else document.getElementById("private-drive-panel")?.scrollIntoView({behavior:"smooth"});
  }
 });
}
function mountTickets(){
 const view=document.getElementById("files-view");
 if(!view||document.getElementById("ticket-collection"))return;
 const section=document.createElement("section");section.id="ticket-collection";
 section.className="pp-ticket-collection";
 const title=view.querySelector(".pp-page-index");
 if(title)title.after(section);else view.prepend(section);
}
function fixOutdatedHelp(){
 const p=document.querySelector("#files-view .help-card p");
 if(p)p.innerHTML='Para compartir las entradas, usad <b>la carpeta restringida de Drive</b> con vuestras tres cuentas. También podéis exportar una copia local para pasarla a otro móvil; <b>si Firebase no está activado, podéis seguir usando las copias manuales. Con Firebase, el código va acompañado de una cuenta autorizada</b>.';
 const panel=document.querySelector("#private-drive-panel .private-warning");
 if(panel)panel.innerHTML='🔒 Solo deben tener acceso las tres personas autorizadas. Compartir una carpeta con un código escrito en la web no protege los documentos: los permisos reales se gestionan en Google Drive.';
 const line=document.querySelector("#files-view .help-card h3");
 if(line)line.textContent="✉ Compartir sin publicar los documentos";
}
function adaptMenus(){
 const oldBookings=document.querySelector("#bookings-view .warning");
 if(oldBookings)oldBookings.textContent="🔒 Las reservas se guardan en este navegador. Para compartir los archivos originales, usad vuestra carpeta privada de Drive.";
}
window.openTicketManagement=function(){
 window.switchTab("files");
 const accordion=document.getElementById("ticket-management");
 if(accordion){
  accordion.open=true;
  accordion.scrollIntoView({behavior:"smooth",block:"start"});
 }
};
function styleBookkeeping(){
 const str=document.querySelector("#bookings-view .pp-page-index .lead");
 if(str)str.textContent="Estado de las reservas, horarios y entradas confirmadas.";
}
mountTickets();
bindPackingEvents();bindTickets();fixOutdatedHelp();adaptMenus();styleBookkeeping();
const originalBookings=window.renderBookings;
if(typeof originalBookings==="function"){
 window.renderBookings=function(){
  originalBookings();renderPacking();renderTicketCollection();
 };
}
const originalFiles=window.renderFiles;
if(typeof originalFiles==="function"){
 window.renderFiles=function(){originalFiles();renderTicketCollection()};
}
const originalTab=window.switchTab;
if(typeof originalTab==="function"){
 window.switchTab=function(tab){
  originalTab(tab);
  if(tab==="checklist")renderPacking();
  if(tab==="files"){renderTicketCollection();fixOutdatedHelp()}
 };
}
window.polarRenderPacking=renderPacking;
window.polarRenderTicketCollection=renderTicketCollection;
renderPacking();renderTicketCollection();
// Rebuild the collection after an import of a private JSON backup.
const originalImport=window.importBackup;
if(typeof originalImport==="function"){
 window.importBackup=async function(event){
  await originalImport(event);
  renderPacking();renderTicketCollection();
 };
}
// Keep fallback if a user opens Tickets before the Drive helper has loaded.
})();