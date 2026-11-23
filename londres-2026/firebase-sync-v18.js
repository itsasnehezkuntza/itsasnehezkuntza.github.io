/* La Patrulla Polar · Firebase opcional, 3 cuentas autorizadas.
   El código selecciona el viaje; NUNCA sustituye a Firebase Auth y Firestore Rules.
   Si no hay proyecto configurado, se conserva el almacenamiento local.
*/
(async function(){
"use strict";
const box=document.getElementById("polar-shared-space");
if(!box)return;
const status=document.getElementById("polar-shared-status");
const codeInput=document.getElementById("polar-trip-code");
const loginBtn=document.getElementById("polar-login-btn");
const connectedBox=document.getElementById("polar-shared-connected");
const userLabel=document.getElementById("polar-shared-user");
const publishBtn=document.getElementById("polar-sync-push");
const signoutBtn=document.getElementById("polar-signout-btn");
const config=window.POLAR_FIREBASE_CONFIG;
const TRIP=String(window.POLAR_FIREBASE_TRIP_ID||"londres-2026");
const CODE=String(window.POLAR_FIREBASE_TRIP_CODE||"POLAR-LONDON-2026");
const bridge=window.PolarSyncBridge;
const setStatus=(message,state)=>{
 status.textContent=message;status.dataset.state=state||"info";
};
function validConfig(c){
 return c&&typeof c==="object"&&
  typeof c.apiKey==="string"&&c.apiKey.length>10&&
  typeof c.projectId==="string"&&c.projectId.length>4&&
  typeof c.authDomain==="string"&&c.authDomain.length>8&&
  typeof c.appId==="string"&&c.appId.length>8;
}
if(!validConfig(config)){
 setStatus("Pendiente de activar Firebase. La checklist y la maleta se guardan en este móvil y podéis exportar una copia.", "pending");
 loginBtn.disabled=true;publishBtn.disabled=true;
 codeInput.disabled=true;
 codeInput.placeholder="Se activará al conectar Firebase";
 return;
}
if(!bridge||typeof bridge.snapshot!=="function"){
 setStatus("No se pudo conectar la checklist al sistema compartido. Los cambios siguen siendo locales.","error");
 return;
}
let activeUser=null;
let confirmedMember=false;
let unsubscribers=[];
function clearWatchers(){
 for(const unsubscribe of unsubscribers){try{unsubscribe()}catch(e){}}
 unsubscribers=[];
 confirmedMember=false;
 activeUser=null;
 connectedBox.hidden=true;
 publishBtn.disabled=true;
}
function updateConnected(){
 connectedBox.hidden=!confirmedMember;
 publishBtn.disabled=!confirmedMember;
 if(activeUser)userLabel.textContent="Conectado/a: "+(activeUser.displayName||activeUser.email||"Cuenta autorizada");
}
let SDK;
try{
 const v="13.4.0";
 const path="https://www.gstatic.com/firebasejs/"+v+"/";
 const [app,auth,firestore]=await Promise.all([
  import(path+"firebase-app.js"),
  import(path+"firebase-auth.js"),
  import(path+"firebase-firestore.js")
 ]);
 SDK={...app,...auth,...firestore};
}catch(e){
 setStatus("No se pudieron descargar las bibliotecas de Firebase. Revisa la conexión.","error");
 return;
}
let app,auth,db;
try{
 app=SDK.initializeApp(config);
 auth=SDK.getAuth(app);
 db=SDK.getFirestore(app);
}catch(e){
 setStatus("La configuración de Firebase necesita revisarse. La información local está a salvo.","error");
 return;
}
const tripCodeReady=()=>{
 const userCode=codeInput.value.trim().toUpperCase().replace(/\s/g,"");
 if(userCode!==CODE){setStatus("El código no coincide con el de este viaje.","error");return false}
 try{localStorage.setItem("polar-trip-selected",TRIP)}catch(e){}
 return true;
};
try{
 if(localStorage.getItem("polar-trip-selected")===TRIP)codeInput.value=CODE;
}catch(e){}
const memberRef=uid=>SDK.doc(db,"trips",TRIP,"members",uid);
const sharedRef=name=>SDK.doc(db,"trips",TRIP,"shared",name);
const personalRef=uid=>SDK.doc(db,"trips",TRIP,"personal",uid);
const paths={
 tasks:sharedRef("tasks"),
 bookings:sharedRef("bookings"),
 packingShared:sharedRef("packing")
};
function canWrite(){return !!(activeUser&&confirmedMember)}
function withoutChanges(before,after){
 const out={};
 const keys=new Set([...Object.keys(before||{}),...Object.keys(after||{})]);
 for(const key of keys){
  if(JSON.stringify(before?.[key])!==JSON.stringify(after?.[key])&&
    Object.prototype.hasOwnProperty.call(after||{},key))out[key]=after[key];
 }
 return out;
}
async function upsert(ref,items,extras){
 const body={items,modifiedAt:SDK.serverTimestamp()};
 if(extras!==undefined)body.extra=extras;
 return SDK.setDoc(ref,body,{merge:true});
}
function subscribe(ref,type){
 return SDK.onSnapshot(ref,snapshot=>{
  if(snapshot.exists())bridge.applyRemote(type,snapshot.data());
 },error=>{
  setStatus("No se puede leer el espacio compartido. Revisad los permisos de Firebase ("+error.code+").","error");
 });
}
async function authorize(user){
 clearWatchers();
 if(!user){setStatus("Introduce el código del viaje y entra con una cuenta autorizada.","info");return}
 if(!tripCodeReady()){setStatus("Has iniciado sesión. Introduce el código del viaje para entrar.","info");return}
 setStatus("Comprobando que tu cuenta esté autorizada…","info");
 let memberDoc;
 try{memberDoc=await SDK.getDoc(memberRef(user.uid))}
 catch(e){
  setStatus("No se puede comprobar tu acceso. Las reglas de Firebase deben publicarse antes de activar el espacio.","error");
  return;
 }
 if(!memberDoc.exists()){
  setStatus("Esta cuenta todavía no está autorizada. UID para añadir en Firebase: "+user.uid,"error");
  return;
 }
 activeUser=user;confirmedMember=true;
 updateConnected();
 const personal=personalRef(user.uid);
 unsubscribers.push(subscribe(paths.tasks,"tasks"));
 unsubscribers.push(subscribe(paths.bookings,"bookings"));
 unsubscribers.push(subscribe(paths.packingShared,"packingShared"));
 unsubscribers.push(subscribe(personal,"packingPersonal"));
 setStatus("Espacio compartido conectado. Los cambios de la checklist y las entradas se sincronizan entre las cuentas autorizadas.","ready");
}
loginBtn.disabled=false;
loginBtn.addEventListener("click",async()=>{
 if(!tripCodeReady())return;
 setStatus("Abriendo el inicio de sesión de Google…","info");
 try{
  const provider=new SDK.GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});
  await SDK.signInWithPopup(auth,provider);
  // onAuthStateChanged autoriza y suscribe una sola vez.
 }catch(e){
  setStatus(e.code==="auth/popup-blocked"?
   "El navegador ha bloqueado el inicio de sesión. Permite las ventanas emergentes para este sitio.":
   "No se pudo iniciar sesión: "+(e.code||"error desconocido"),"error");
 }
});
signoutBtn.addEventListener("click",async()=>{
 clearWatchers();
 try{await SDK.signOut(auth)}catch(e){}
 setStatus("Sesión cerrada. Puedes seguir usando las listas locales.","info");
});
publishBtn.addEventListener("click",async()=>{
 if(!canWrite())return;
 if(!confirm("¿Subir los estados de este móvil al espacio compartido? Esto puede sustituir cambios más recientes de otras personas. Los PDFs NO se subirán."))return;
 const s=bridge.snapshot(); // tomar el estado actual, no una copia antigua
 publishBtn.disabled=true;
 try{
  await Promise.all([
   upsert(paths.tasks,s.tasks),
   upsert(paths.bookings,s.bookings),
   upsert(paths.packingShared,s.packingShared,s.extrasShared),
   upsert(personalRef(activeUser.uid),s.packingPersonal,s.extrasPersonal)
  ]);
  setStatus("Estados locales publicados en el espacio compartido. Los PDFs siguen en Drive.","ready");
 }catch(e){
  setStatus("No se ha podido publicar: "+(e.code||e.message)+". La copia local se conserva.","error");
 }finally{publishBtn.disabled=!canWrite()}
});
window.addEventListener("polar:local-change",async e=>{
 if(!canWrite())return;
 const before=e.detail?.before,after=e.detail?.after;
 if(!before||!after)return;
 const writes=[];
 const dt=withoutChanges(before.tasks,after.tasks);
 if(Object.keys(dt).length)writes.push(upsert(paths.tasks,dt));
 const dbk=withoutChanges(before.bookings,after.bookings);
 if(Object.keys(dbk).length)writes.push(upsert(paths.bookings,dbk));
 const dsh=withoutChanges(before.packingShared,after.packingShared);
 if(Object.keys(dsh).length||JSON.stringify(before.extrasShared)!==JSON.stringify(after.extrasShared)){
  writes.push(upsert(paths.packingShared,dsh,
   JSON.stringify(before.extrasShared)!==JSON.stringify(after.extrasShared)?after.extrasShared:undefined));
 }
 const dpe=withoutChanges(before.packingPersonal,after.packingPersonal);
 if(Object.keys(dpe).length||JSON.stringify(before.extrasPersonal)!==JSON.stringify(after.extrasPersonal)){
  writes.push(upsert(personalRef(activeUser.uid),dpe,
   JSON.stringify(before.extrasPersonal)!==JSON.stringify(after.extrasPersonal)?after.extrasPersonal:undefined));
 }
 if(writes.length){
  try{await Promise.all(writes)}
  catch(err){
   setStatus("No se sincronizó un cambio ("+(err.code||"error")+"). Se conserva en este navegador.","error");
  }
 }
});
SDK.onAuthStateChanged(auth,user=>{
 if(user&&codeInput.value===CODE)authorize(user);
 else if(user){
  loginBtn.textContent="Entrar en el viaje";
  setStatus("Cuenta de Google iniciada. Introduce el código para abrir el viaje.","info");
 }else{
  clearWatchers();
  setStatus("Introduce el código y entra con Google para sincronizar.","info");
 }
});
})();