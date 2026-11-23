/* LA PATRULLA POLAR · Temporizador hasta el vuelo de Bilbao
 * No requiere cuentas, servicios externos ni datos personales.
 */
(function(){
"use strict";
const TAKEOFF_UTC=Date.parse("2026-12-06T13:35:00Z"); // 14:35 Europe/Madrid (CET)
const clock={
 days:document.getElementById("polar-cd-days"),
 hours:document.getElementById("polar-cd-hours"),
 mins:document.getElementById("polar-cd-mins"),
 secs:document.getElementById("polar-cd-secs"),
 caption:document.getElementById("polar-cd-caption"),
 box:document.getElementById("polar-countdown")
};
function drawCountdown(){
 if(!clock.box)return;
 let remaining=Math.max(0,Math.floor((TAKEOFF_UTC-Date.now())/1000));
 const days=Math.floor(remaining/86400);remaining-=days*86400;
 const hours=Math.floor(remaining/3600);remaining-=hours*3600;
 const minutes=Math.floor(remaining/60),seconds=remaining-minutes*60;
 const pad=n=>String(n).padStart(2,"0");
 if(clock.days)clock.days.textContent=pad(days);
 if(clock.hours)clock.hours.textContent=pad(hours);
 if(clock.mins)clock.mins.textContent=pad(minutes);
 if(clock.secs)clock.secs.textContent=pad(seconds);
 const departed=Date.now()>=TAKEOFF_UTC;
 clock.box.classList.toggle("polar-countdown-departed",departed);
 if(clock.caption)clock.caption.textContent=departed?
  "🐾 ¡La Patrulla Polar ya se ha puesto en marcha!":
  "Domingo 6 · 14:35 (hora de Bilbao)";
}
drawCountdown();
const interval=setInterval(()=>{
 if(!document.hidden)drawCountdown();
},1000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)drawCountdown()});
window.addEventListener("pagehide",()=>clearInterval(interval),{once:true});
// Evitar frases de relleno en los apartados dinámicos.
const existing=window.renderDay;
if(typeof existing==="function"){
 window.renderDay=function(){
  existing();
  const chapter=document.querySelector(".day-head .chapter-tag");
  if(chapter){
   const d=DAYS[state.day];
   if(d)chapter.textContent="🐾 DÍA "+d.n+" · "+d.long.toUpperCase()+" "+d.n+" DE DICIEMBRE";
  }
  const foot=document.querySelector(".focus-paper-top .trip-section-label");
  if(foot)foot.textContent="🐾 HOY EN LONDRES";
 };
 window.renderDay();
}
})();