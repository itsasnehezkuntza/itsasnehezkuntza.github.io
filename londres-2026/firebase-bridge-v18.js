/* La Patrulla Polar · puente entre la web existente y Firebase.
   NO contiene credenciales. No sincroniza PDFs ni notas/localizadores.
   Todos los cambios se siguen guardando en el navegador.
*/
(function(){
"use strict";
const SHARED_PACK_IDS=new Set(["tickets","apartment","umbrella","firstaid","groupadapter","groupplans"]);
const isObj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const copy=x=>JSON.parse(JSON.stringify(x));
const validBool=v=>typeof v==="boolean";
const allowedStatus=new Set(["todo","done","skip"]);
let applyingRemote=false;
let suppressImport=false;
function snapshot(){
 const task={};
 for(const item of TASKS){
  const val=state.task?.[item.id];
  if(validBool(val))task[item.id]=val;
 }
 const bookings={};
 for(const item of BOOK){
  const b=state.booking?.[item.id];
  if(!isObj(b))continue;
  const v={};
  if(allowedStatus.has(b.status))v.status=b.status;
  if(typeof b.time==="string")v.time=b.time.slice(0,40);
  if(Object.keys(v).length)bookings[item.id]=v;
 }
 const packingShared={},packingPersonal={};
 for(const [id,flag] of Object.entries(state.packing||{})){
  if(!validBool(flag)||!/^([a-z][a-z0-9-]{1,70})$/.test(id))continue;
  (SHARED_PACK_IDS.has(id)||state.packingExtra?.some(x=>x.id===id&&x.kind==="shared")?packingShared:packingPersonal)[id]=flag;
 }
 const extras=Array.isArray(state.packingExtra)?state.packingExtra:[];
 const cleanExtra=(kind)=>extras.filter(x=>isObj(x)&&x.kind===kind&&
  typeof x.id==="string"&&/^extra-[a-z0-9-]{1,55}$/.test(x.id)&&
  typeof x.label==="string").slice(0,50).map(x=>({id:x.id,label:x.label.slice(0,70),kind}));
 return {tasks:task,bookings,packingShared,packingPersonal,
   extrasShared:cleanExtra("shared"),extrasPersonal:cleanExtra("personal")};
}
let previous=snapshot();
function rerender(){
 try{window.renderBookings?.()}catch(e){console.warn("renderBookings",e)}
 try{window.renderDay?.()}catch(e){console.warn("renderDay",e)}
 try{window.polarRenderPacking?.()}catch(e){console.warn("packing",e)}
 try{window.polarRenderTicketCollection?.()}catch(e){console.warn("tickets",e)}
}
const originalSave=window.save;
if(typeof originalSave!=="function"){console.warn("Polar sync: no hay función save");return}
window.save=function(){
 originalSave();
 const now=snapshot();
 if(!applyingRemote&&!suppressImport&&JSON.stringify(previous)!==JSON.stringify(now)){
  window.dispatchEvent(new CustomEvent("polar:local-change",{detail:{before:copy(previous),after:copy(now)}}));
 }
 previous=now;
};
function changePacking(items,group){
 if(!isObj(items))return;
 if(!isObj(state.packing))state.packing={};
 const extras=Array.isArray(state.packingExtra)?state.packingExtra:[];
 for(const [id,flag] of Object.entries(items)){
  if(!validBool(flag)||typeof id!=="string"||id.length>75)continue;
  const isShared=SHARED_PACK_IDS.has(id)||extras.some(x=>x.id===id&&x.kind==="shared");
  if(group==="shared"&&!isShared&&id.indexOf("extra-")!==0)continue;
  if(group==="personal"&&SHARED_PACK_IDS.has(id))continue;
  state.packing[id]=flag;
 }
}
function cleanRemoteExtra(input,kind){
 if(!Array.isArray(input))return null;
 return input.filter(x=>isObj(x)&&x.kind===kind&&typeof x.id==="string"&&
   /^extra-[a-z0-9-]{1,55}$/.test(x.id)&&typeof x.label==="string")
  .slice(0,50).map(x=>({id:x.id,label:x.label.slice(0,70),kind}));
}
function applyRemote(type,data){
 if(!isObj(data))return;
 applyingRemote=true;
 try{
  if(type==="tasks"&&isObj(data.items)){
   if(!isObj(state.task))state.task={};
   const allowed=new Set(TASKS.map(x=>x.id));
   for(const [id,val] of Object.entries(data.items)){
    if(allowed.has(id)&&validBool(val))state.task[id]=val;
   }
  }
  if(type==="bookings"&&isObj(data.items)){
   if(!isObj(state.booking))state.booking={};
   const allowed=new Set(BOOK.map(x=>x.id));
   for(const [id,fields] of Object.entries(data.items)){
    if(!allowed.has(id)||!isObj(fields))continue;
    const out=isObj(state.booking[id])?{...state.booking[id]}:{};
    if(allowedStatus.has(fields.status))out.status=fields.status;
    if(typeof fields.time==="string")out.time=fields.time.slice(0,40);
    state.booking[id]=out;
   }
  }
  if(type==="packingShared"||type==="packingPersonal"){
   const kind=type==="packingShared"?"shared":"personal";
   changePacking(data.items,kind);
   const remote=cleanRemoteExtra(data.extra,kind);
   if(remote!==null){
    if(!Array.isArray(state.packingExtra))state.packingExtra=[];
    state.packingExtra=state.packingExtra.filter(x=>x.kind!==kind).concat(remote);
   }
  }
  originalSave();
  previous=snapshot();
  rerender();
 }finally{applyingRemote=false}
}
window.PolarSyncBridge={
 snapshot:()=>copy(snapshot()),
 applyRemote,
 refresh:rerender
};
// Importar una copia local NO debería pisar automáticamente el estado compartido.
const priorImport=window.importBackup;
if(typeof priorImport==="function"){
 window.importBackup=async function(event){
  suppressImport=true;
  try{return await priorImport(event)}
  finally{suppressImport=false;previous=snapshot()}
 };
}
})();