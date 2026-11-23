/* Londres 2026 · Fotografías verificadas y datos prácticos por jornada.
   Las imágenes vienen de Wikimedia Commons y muestran siempre la fuente.
   No se cargan documentos ni enlaces de Drive desde esta parte. */
(function(){
"use strict";
const DAYS_PLUS={
"2026-12-06":{
 title:"Antes de salir de Gatwick",
 intro:"El primer día está dedicado a llegar sin prisas: aeropuerto, tren y alojamiento.",
 photos:[],
 notes:[
  ["Tren a Londres","Comprobad el próximo Thameslink a Farringdon antes de bajar a los andenes.","https://www.thameslinkrailway.com/"],
  ["Llegada al apartamento","El check-in es lo importante de esta noche. Si hay retraso, consultad las instrucciones de acceso."]
 ]
},
"2026-12-07":{
 title:"Un paseo por el Londres histórico",
 intro:"Desde el puente más fotografiado de la ciudad hasta las calles medievales de la City.",
 photos:[
  ["bridge","Tower Bridge","Las pasarelas tienen suelo de cristal y vistas del Támesis."],
  ["borough","Borough Market","Puestos de comida y ambiente navideño al mediodía."]
 ],
 notes:[
  ["Mercado de Navidad","Borough Market abre los lunes de diciembre de 2026. Id con algo de hambre.","https://boroughmarket.org.uk/events/christmas-at-borough-market/"],
  ["Tower Bridge","La visita interior necesita entrada. Comprobad el horario exacto antes de organizar el resto.","https://www.towerbridge.org.uk/whats-on/entry-to-tower-bridge"],
  ["Mirador gratuito","The Garden at 120 es exterior: con lluvia o viento fuerte puede haber cambios."]
 ]
},
"2026-12-08":{
 title:"Museos y luces de Navidad",
 intro:"Dinosaurios y ciencia por la mañana; Regent Street iluminada y atracciones después.",
 photos:[
  ["natural","La galería de dinosaurios","Tiranosaurios, esqueletos y fósiles del Natural History Museum."],
  ["hamleys","Regent Street en Navidad","El paseo por las luces encaja antes de ir a Hyde Park."],
  ["winter","Winter Wonderland","Las montañas rusas y las luces del recinto son la protagonista de la noche."]
 ],
 notes:[
  ["Museo de dinosaurios","La entrada general es gratuita. Reservar con antelación ayuda a garantizar el acceso.","https://www.nhm.ac.uk/visit.html"],
  ["Entrada a Winter Wonderland","La entrada estándar de £5,50 permite entrar en el recinto; las atracciones se pagan aparte. Comprobad vuestra franja exacta.","https://hydeparkwinterwonderland.com/tickets-guide/"],
  ["Tiempo para las atracciones","Una vez dentro podéis quedaros hasta el cierre. Algunas colas terminan antes, así que subid primero a lo que más os interese.","https://hydeparkwinterwonderland.com/tickets-guide/"]
 ]
},
"2026-12-09":{
 title:"El Londres de película",
 intro:"La guardia real, Westminster y una de las zonas mejor decoradas en Navidad.",
 photos:[
  ["covent","Covent Garden","Gran árbol de Navidad, decoración de la plaza y ambiente festivo."],
  ["buckingham","Buckingham Palace","El cambio de guardia puede verse alterado por la meteorología."]
 ],
 notes:[
  ["Cambio de guardia","Llegad con antelación a Wellington Barracks. El desfile depende del tiempo y de la programación oficial.","https://www.householddivision.org.uk/changing-the-guard-calendar"],
  ["Navidad en Covent Garden","En 2026 hay decoración especial y nevadas artificiales en la plaza; la programación es gratuita de ver.","https://www.coventgarden.london/experience/christmas-in-covent-garden"],
  ["Sin patinaje obligatorio","Somerset House se puede disfrutar desde fuera. Así dejáis el presupuesto para las atracciones del martes."]
 ]
},
"2026-12-10":{
 title:"Arte urbano y mercados",
 intro:"Una mañana menos monumental: murales, tiendas independientes y un bagel en Brick Lane.",
 photos:[
  ["brick","Street art de Brick Lane","Los murales cambian continuamente: vale la pena mirar las calles laterales."],
  ["spital","Old Spitalfields Market","Un mercado cubierto para terminar la mañana."]
 ],
 notes:[
  ["No os desviéis demasiado","Una persona vuela desde Gatwick esa tarde. Reservad margen suficiente para volver por la maleta."],
  ["Buen plan con lluvia","Spitalfields está cubierto y tiene cafeterías y puestos para hacer una pausa."],
  ["Bagel económico","Brick Lane es una opción práctica para comer rápido antes del mercado."]
 ]
},
"2026-12-11":{
 title:"Una escapada fuera de Londres",
 intro:"Historia inglesa, callejuelas y catedral; Camden queda como opción al regreso.",
 photos:[
  ["stalbans","St Albans Cathedral","Una de las grandes catedrales históricas de Inglaterra."],
  ["camden","Camden Town","Si regresáis con tiempo, os queda una tarde para pasear por el mercado."]
 ],
 notes:[
  ["Billete de tren","St Albans queda fuera de las zonas 1–2. Comprobad el coste de ida y vuelta antes de salir.","https://www.thameslinkrailway.com/"],
  ["Plan flexible","Camden es opcional: si os entretenéis en St Albans, no pasa nada por quitarlo."],
  ["Mercados","Los horarios festivos y de los puestos pueden variar. No baséis toda la excursión en un mercadillo."]
 ]
},
"2026-12-12":{
 title:"Vuelta a casa",
 intro:"Última mañana: equipaje, estación y aeropuerto.",
 photos:[],
 notes:[
  ["Salida con margen","Comprobad que el tren llega a Gatwick con tiempo suficiente para seguridad y embarque."],
  ["Billetes a mano","Guardad las tarjetas de embarque descargadas en el teléfono, además de la copia en Drive."]
 ]
}
};
const textSafe=(input)=>String(input??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let renderCounter=0;
function selectedStop(key){
 const d=DAYS[state.day];const i=d.stops.findIndex(x=>x.place===key);
 if(i>=0&&typeof window.focusStop==="function")window.focusStop(i+1);
}
window.londonScrollToPhoto=selectedStop;
function showGallery(){
 const date=DAYS[state.day]?.date,details=DAYS_PLUS[date];if(!details)return;
 let wrapper=document.getElementById("day-editorial");
 if(!wrapper){
  wrapper=document.createElement("section");wrapper.id="day-editorial";wrapper.className="day-editorial";
  document.getElementById("day-header").after(wrapper);
 }
 const serial=++renderCounter;
 const gallery=details.photos.length
  ?'<div class="editorial-gallery"><div class="section-inline"><div><span class="editorial-eyebrow">LOS LUGARES</span><h3>Antes de llegar</h3></div><span class="gallery-hint">Fotos reales · Wikimedia Commons</span></div>'+
   '<div class="day-photo-row">'+details.photos.map(([key,title,description])=>
    '<article class="day-photo-item" data-place="'+textSafe(key)+'">'+
    '<button type="button" class="day-photo-image" data-focus="'+textSafe(key)+'" aria-label="Ver '+textSafe(title)+' en el mapa">'+
    '<span class="image-skeleton">Cargando fotografía…</span></button>'+
    '<div class="day-photo-copy"><h4>'+textSafe(title)+'</h4><p>'+textSafe(description)+'</p>'+
    '<button type="button" class="day-photo-location" data-focus="'+textSafe(key)+'">Ver en el mapa ↗</button></div>'+
    '<div class="day-photo-credit"></div></article>').join("")+
    '</div></div>'
  :"";
 const tips='<section class="day-tips"><div class="section-inline"><div><span class="editorial-eyebrow">LO QUE IMPORTA</span><h3>Antes de salir</h3></div></div>'+
 '<div class="tip-cards">'+details.notes.map(([title,desc,link])=>'<div class="tip-card"><strong>'+textSafe(title)+'</strong><p>'+textSafe(desc)+'</p>'+
 (link?'<a href="'+textSafe(link)+'" target="_blank" rel="noopener noreferrer">Información oficial ↗</a>':"")+
 '</div>').join("")+'</div></section>';
 wrapper.innerHTML=gallery;
 const dayNote=document.getElementById('day-note');
 if(dayNote)dayNote.insertAdjacentHTML('beforeend',tips);
 wrapper.querySelectorAll("[data-focus]").forEach(el=>el.addEventListener("click",()=>selectedStop(el.dataset.focus)));
 if(!details.photos.length)return;
 for(const [key,title,description] of details.photos){
  Promise.resolve(typeof window.londonTripPhoto==="function"?window.londonTripPhoto(key):null).then(photo=>{
    if(serial!==renderCounter)return;
    const item=[...wrapper.querySelectorAll(".day-photo-item")].find(x=>x.dataset.place===key);if(!item)return;
    const photoSpace=item.querySelector(".day-photo-image"),credit=item.querySelector(".day-photo-credit");
    if(photo?.src&&photo?.src.startsWith("https://upload.wikimedia.org/")){
      photoSpace.innerHTML='<img src="'+textSafe(photo.src)+'" alt="'+textSafe(title)+'" loading="lazy" referrerpolicy="no-referrer"><span class="photo-zoom">Ver parada ↗</span>';
      photoSpace.querySelector("img").addEventListener("error",()=>{photoSpace.classList.add("image-unavailable");photoSpace.innerHTML='<span>Foto temporalmente no disponible</span>'});
      credit.innerHTML='<a href="'+textSafe(photo.page)+'" target="_blank" rel="noopener noreferrer">'+textSafe(photo.credit||"Fotografía en Wikimedia Commons")+' ↗</a>';
    }else{
      photoSpace.classList.add("image-unavailable");
      photoSpace.innerHTML='<span>Ver parada en el mapa ↗</span>';
    }
  }).catch(()=>{
    const item=[...wrapper.querySelectorAll(".day-photo-item")].find(x=>x.dataset.place===key);
    if(item)item.querySelector(".day-photo-image").innerHTML='<span>Ver parada en el mapa ↗</span>';
  });
 }
}
const oldRender=window.renderDay;
if(typeof oldRender==="function"){
 window.renderDay=function(){oldRender();showGallery()};
 showGallery();
}
})();
