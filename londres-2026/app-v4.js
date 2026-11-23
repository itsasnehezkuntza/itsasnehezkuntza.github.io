/* London Travel Journal: capítulos por día, decoraciones accesibles */
(function(){
"use strict";
function decorateDay(){
 const box=document.querySelector(".day-head");
 if(!box||!window.DAYS&&typeof DAYS==="undefined")return;
 const date=typeof DAYS!=="undefined"?DAYS[state.day]||DAYS[0]:null;
 if(!date)return;
 if(!box.querySelector(".chapter-tag")){
  const tag=document.createElement("div");tag.className="chapter-tag";
  const index=String(state.day+1).padStart(2,"0");
  tag.textContent="CAPÍTULO "+index+" / 07 · "+date.short.toUpperCase()+" "+date.n+" DIC";
  const kicker=box.querySelector(".kicker");
  if(kicker)kicker.after(tag);else box.prepend(tag);
 }
}
const prevRender=window.renderDay;
if(typeof prevRender!=="function")return;
window.renderDay=function(){prevRender();decorateDay()};
decorateDay();
})();