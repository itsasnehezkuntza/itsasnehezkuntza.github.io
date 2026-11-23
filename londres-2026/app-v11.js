/* Londres Navidad 2026 · Vuelos y meteorología
 * Fuente vuelos: comprobantes privados del grupo; jamás se publican localizadores, nombres ni QR.
 * Meteo: Open-Meteo API, pronóstico orientativo actualizable hasta 16 días.
 */
(function(){
"use strict";
const FLIGHTS=[
 {date:"DOMINGO 6 DIC",scope:"IDA · TRAMO 1/2",flight:"VY1465",origin:"BIO",destination:"BCN",
  originName:"Bilbao",destinationName:"Barcelona",depart:"14:35",arrive:"15:45",info:"Vueling · Llegada a Barcelona T1",verified:true},
 {date:"DOMINGO 6 DIC",scope:"IDA · TRAMO 2/2",flight:"VY7624",origin:"BCN",destination:"LGW",
  originName:"Barcelona T1",destinationName:"Gatwick · Terminal Sur",depart:"18:10",arrive:"19:25",info:"Conexión de 2 h 25 min en Barcelona · Vueling",verified:true},
 {date:"JUEVES 10 DIC",scope:"VUELTA · 1 PERSONA",flight:"VY7655",origin:"LGW",destination:"BIO",
  originName:"Londres Gatwick",destinationName:"Bilbao",depart:"19:45",arrive:"22:35",info:"Vueling · Datos comprobados en la captura del vuelo",verified:true},
 {date:"SÁBADO 12 DIC",scope:"VUELTA · 2 PERSONAS",flight:"Por confirmar",origin:"LGW",destination:"BIO",
  originName:"Londres Gatwick",destinationName:"Bilbao",depart:"12:45",arrive:"15:45*",info:"*Horarios anotados en vuestro documento de planificación. Falta justificante de aerolínea.",verified:false}
];
const ESC=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderBoardingTickets(){
 const host=document.getElementById("flight-passes");if(!host)return;
 const cards=FLIGHTS.map(f=>
 '<article class="travel-flight-card" aria-label="Vuelo '+ESC(f.flight)+' '+ESC(f.originName)+' a '+ESC(f.destinationName)+'">'+
 '<div class="travel-flight-top"><span class="flight-top-glyph" aria-hidden="true">✈</span><span>'+ESC(f.scope)+'</span><span>'+ESC(f.date)+'</span></div>'+
 '<div class="travel-flight-main"><div class="travel-flight-airports">'+
 '<div><small>ORIGEN</small><strong>'+ESC(f.origin)+'</strong><span>'+ESC(f.originName)+'</span></div>'+
 '<div class="flight-path" aria-hidden="true"><span>✈</span></div>'+
 '<div><small>DESTINO</small><strong>'+ESC(f.destination)+'</strong><span>'+ESC(f.destinationName)+'</span></div></div>'+
 '<div class="travel-flight-times"><div><small>SALIDA · HORA LOCAL</small><strong>'+ESC(f.depart)+'</strong></div>'+
 '<div><small>LLEGADA · HORA LOCAL</small><strong>'+ESC(f.arrive)+'</strong></div></div>'+
 '</div><div class="travel-flight-footer"><div><small>VUELO</small><strong>'+ESC(f.flight)+'</strong></div>'+
 '<span class="flight-confirmed '+(f.verified?"":"flight-pending")+'">'+(f.verified?"Horario en captura":"Falta justificante")+'</span></div>'+
 '<p class="flight-support">'+ESC(f.info)+'</p></article>').join("");
 host.innerHTML='<div class="travel-section-heading"><span class="travel-section-kicker">✈️ BILLETES DE VIAJE</span><h3>Vuelos, de un vistazo</h3>'+
 '<p>Tarjetas informativas basadas en los archivos de vuestra carpeta privada; no son tarjetas de embarque y no sirven para pasar el control.</p></div>'+
 '<div class="travel-flight-grid">'+cards+'</div>'+
 '<div class="travel-travel-note"><span aria-hidden="true">🧳</span><span>Los horarios son locales de cada aeropuerto: España va una hora por delante de Londres en diciembre. La puerta, el asiento y el embarque se comprobarán con Vueling. El vuelo del sábado todavía necesita justificante.</span></div>';
}
const WEATHER_URL="https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&daily=weather_code%2Ctemperature_2m_max%2Ctemperature_2m_min%2Cprecipitation_probability_max&timezone=Europe%2FLondon&forecast_days=16";
const WMO=[
 {max:0,symbol:"☀️",label:"Despejado"},
 {max:2,symbol:"🌤️",label:"Intervalos de sol"},
 {max:3,symbol:"☁️",label:"Nublado"},
 {max:48,symbol:"🌫️",label:"Niebla"},
 {max:57,symbol:"🌦️",label:"Llovizna"},
 {max:67,symbol:"🌧️",label:"Lluvia"},
 {max:77,symbol:"🌨️",label:"Nieve"},
 {max:82,symbol:"🌧️",label:"Chubascos"},
 {max:86,symbol:"🌨️",label:"Nieve"},
 {max:99,symbol:"⛈️",label:"Tormentas"}
];
let forecast=null,fetchFailed=false,requestStarted=false;
function wmo(code){return WMO.find(x=>code<=x.max)||{symbol:"🌥️",label:"Tiempo variable"}}
function diffDays(date){
 const dt=new Date(date+"T12:00:00Z");
 return Math.round((dt-Date.now())/86400000);
}
function readForecast(date){
 if(!forecast)return null;
 const i=forecast.time?.indexOf(date);
 if(i===undefined||i<0)return null;
 const tempMax=forecast.temperature_2m_max?.[i],tempMin=forecast.temperature_2m_min?.[i];
 const rain=forecast.precipitation_probability_max?.[i];
 const weatherCode=forecast.weather_code?.[i];
 if(!Number.isFinite(tempMax)||!Number.isFinite(tempMin)||!Number.isFinite(weatherCode))return null;
 return {tempMax,tempMin,rain,weatherCode,...wmo(weatherCode)};
}
function weatherText(f){
 if(!f)return "Previsión no disponible";
 if(Number.isFinite(f.rain)){
  if(f.rain>=75)return "Riesgo alto de lluvia";
  if(f.rain>=40)return "Posibilidad de lluvia";
  if(f.rain<=25)return "Poca lluvia prevista";
 }
 return f.label;
}
function dayLabel(date){
 const d=DAYS.find(x=>x.date===date);return d?d.short+" "+d.n:"";
}
function officialWeatherLink(){
 return '<a href="https://weather.metoffice.gov.uk/forecast/gcpvj0v07" target="_blank" rel="noopener noreferrer">Met Office ↗</a>';
}
function renderDailyWeather(){
 const host=document.getElementById("day-header");if(!host)return;
 const date=DAYS[state.day]?.date;if(!date)return;
 let box=host.querySelector("#trip-weather-today");
 if(!box){box=document.createElement("section");box.id="trip-weather-today";box.className="trip-weather-today";host.appendChild(box)}
 const d=diffDays(date),f=readForecast(date);
 if(f){
  const range=Math.round(f.tempMin)+"° / "+Math.round(f.tempMax)+"°";
  box.innerHTML='<div class="weather-icon" aria-hidden="true">'+f.symbol+'</div><div class="weather-current-text">'+
    '<small>EL TIEMPO · LONDRES '+(d>7?"(TENDENCIA PROVISIONAL)":"")+'</small>'+
    '<strong>'+ESC(f.label)+' · '+range+'</strong>'+
    '<span>'+ESC(weatherText(f))+(Number.isFinite(f.rain)?" · Máx. prob. lluvia "+Math.round(f.rain)+"%":"")+'</span></div>'+
    '<a class="weather-source" href="https://weather.metoffice.gov.uk/forecast/gcpvj0v07" target="_blank" rel="noopener noreferrer">Ver previsión ↗</a>';
 }else{
  box.innerHTML='<div class="weather-icon" aria-hidden="true">🌦️</div><div class="weather-current-text">'+
    '<small>EL TIEMPO · LONDRES</small><strong>'+(fetchFailed?"No se pudo consultar":"Todavía sin previsión para esta fecha")+'</strong>'+
    '<span>'+(d>10?"La previsión diaria aún puede quedar fuera del alcance de los modelos.":"Consultad la predicción actualizada antes de salir.")+'</span></div>'+
    '<a class="weather-source" href="https://weather.metoffice.gov.uk/forecast/gcpvj0v07" target="_blank" rel="noopener noreferrer">Met Office ↗</a>';
 }
}
function renderWeek(){
 const host=document.getElementById("weather-week");if(!host)return;
 const cards=DAYS.map(d=>{
  const f=readForecast(d.date),days=diffDays(d.date),risk=days>7?"Tendencia temprana":days>3?"Todavía variable":"Previsión a corto plazo";
  return '<div class="weather-day-card"><span class="weather-day-date">'+ESC(dayLabel(d.date))+'</span>'+
   '<strong class="weather-day-icon" aria-hidden="true">'+(f?f.symbol:"🌦️")+'</strong>'+
   '<span class="weather-day-condition">'+(f?ESC(f.label):"Sin previsión")+'</span>'+
   '<strong class="weather-day-temp">'+(f?Math.round(f.tempMin)+"°–"+Math.round(f.tempMax)+"°":"—")+'</strong>'+
   '<small class="weather-rain">'+(f&&Number.isFinite(f.rain)?"☂ "+Math.round(f.rain)+"%":"Pendiente")+'</small>'+
   '<small class="weather-confidence">'+(f?risk:days>0?"Aún no disponible":"Sin datos")+'</small></div>';
 }).join("");
 host.innerHTML='<div class="travel-section-heading"><span class="travel-section-kicker">🌦️ EL CIELO DE LONDRES</span>'+
  '<h3>¿Nos mojaremos?</h3><p>Previsión diaria actualizada al abrir esta página. Puede cambiar, especialmente cuando falta más de una semana. <strong>Si todavía no hay pronóstico, no se muestran valores inventados.</strong></p></div>'+
  '<div class="weather-day-grid">'+cards+'</div>'+
  '<div class="weather-foot">Datos: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · '+officialWeatherLink()+
  '<span>'+(fetchFailed?" No se pudo actualizar; revisad conexión.":" Temperaturas mín. / máx. y máxima probabilidad diaria de precipitación.")+'</span></div>';
}
function updateAll(){renderDailyWeather();renderWeek()}
async function loadForecast(){
 if(requestStarted)return;requestStarted=true;
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),10000);
 try{
  const resp=await fetch(WEATHER_URL,{signal:ctrl.signal,credentials:"omit",cache:"no-store"});
  if(!resp.ok)throw Error("weather API unavailable");
  const data=await resp.json();
  if(!Array.isArray(data.daily?.time))throw Error("weather response invalid");
  forecast=data.daily;fetchFailed=false;
 }catch(e){fetchFailed=true}
 finally{clearTimeout(timer);updateAll()}
}
function injectFlightsIntoDay(){
 const date=DAYS[state.day]?.date;
 const flightIndexes={
  "2026-12-06":[0,1],
  "2026-12-10":[2],
  "2026-12-12":[3]
 };
 const indexes=flightIndexes[date];
 if(!indexes)return;
 const host=document.getElementById("day-focus");
 const complete=[...document.querySelectorAll("#flight-passes .travel-flight-card")];
 if(!host||!complete.length)return;
 // El bloque se reconstruye al cambiar el día; no se duplican los billetes.
 host.querySelector(".day-flight-passes")?.remove();
 const section=document.createElement("section");
 section.className="day-flight-passes";
 section.setAttribute("aria-label","Vuelos del día");
 const heading=document.createElement("div");
 heading.className="day-flight-heading";
 heading.innerHTML='<span class="day-flight-figure" aria-hidden="true">✈️</span>'+
  '<div><small>EL VIAJE DE HOY</small><h3>'+(date==="2026-12-06"?"Nuestros vuelos de ida":"Vuelo de regreso")+'</h3></div>';
 section.append(heading);
 const grid=document.createElement("div");
 grid.className="travel-flight-grid day-flight-grid";
 for(const i of indexes){
  if(complete[i])grid.append(complete[i].cloneNode(true));
 }
 section.append(grid);
 const note=document.createElement("p");
 note.className="day-flight-disclaimer";
 note.textContent=date==="2026-12-12"?
  "Horario apuntado en el plan; falta verificar la reserva del sábado. Este dibujo no es una tarjeta de embarque.":
  "Horas locales de cada aeropuerto. El billete visual es informativo: llevad vuestra tarjeta de embarque real.";
 section.append(note);
 host.prepend(section);
}
function ensureReservedState(){
 // Actualiza estados antiguos pendientes, pero respeta si alguien descartó la actividad.
 try{if(localStorage.getItem("london2026.confirmed.v11"))return;}catch(e){return;}
 const times={tower:"10:30",natural:"11:15",winter:"17:00–18:00",skate:"21:00"};
 for(const [id,time] of Object.entries(times)){
   const prior=state.booking[id]||{};
   if(prior.status==="skip")continue;
   if(prior.status==="todo"||!prior.status){
     state.booking[id]={...prior,status:"done",time};
   }
 }
 for(const id of ["towerDone","naturalDone","winterDone","skateDone"]){
   if(state.task[id]!==true)state.task[id]=true;
 }
 save();
 try{localStorage.setItem("london2026.confirmed.v11","1")}catch(e){}
}
const prior=window.renderDay;
if(typeof prior==="function"){
 window.renderDay=function(){
  prior();
  renderDailyWeather();
  injectFlightsIntoDay();
 };
}
ensureReservedState();
renderBoardingTickets();
updateAll();
loadForecast();
window.renderBookings?.();
window.renderDay?.();
})();