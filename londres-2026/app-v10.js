/* v10 · El mismo código de colores del mapa acompaña al itinerario. */
(function(){
"use strict";
const MODE={
 walk:{icon:"🚶",label:"A pie"},
 metro:{icon:"🚇",label:"Metro"},
 train:{icon:"🚆",label:"Tren"},
 mixed:{icon:"🚆",label:"Tren + metro"},
 transport:{icon:"🚌",label:"Transporte"}
};
function annotateTrips(){
 const d=DAYS[state.day]||DAYS[0];
 const rows=[...document.querySelectorAll("#timeline .stop")];
 if(typeof window.londonTransportBetween!=="function")return;
 rows.forEach((row,i)=>{
  if(i===0)return;
  const before=d.stops[i-1],after=d.stops[i];
  if(!before||!after||before.place===after.place||!PLACE[before.place]||!PLACE[after.place])return;
  const mode=window.londonTransportBetween(d,
   {place:before.place,coords:PLACE[before.place]},
   {place:after.place,coords:PLACE[after.place]});
  const item=MODE[mode]||MODE.transport;
  const wrapper=document.createElement("div");wrapper.className="trip-transfer trip-transfer-"+mode;
  wrapper.setAttribute("role","note");
  wrapper.setAttribute("aria-label","Traslado desde "+before.title+" a "+after.title+": "+item.label);
  const label=document.createElement("span");label.className="trip-transfer-label";
  label.textContent=item.icon+" "+item.label;
  wrapper.append(label);row.before(wrapper);
 });
}
const oldRender=window.renderDay;
if(typeof oldRender!=="function")return;
window.renderDay=function(){oldRender();annotateTrips()};
annotateTrips();
})();
