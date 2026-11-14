import { localDate, validateBooking, bookingText } from './booking.js';
const $ = id => document.getElementById(id);
let step=0, map, markers={}, line, pick='from';
const points={from:null,to:null};
const form=$('booking-form');
$('date').min=localDate();
function data(){return {service:form.elements.service.value,items:[...form.querySelectorAll('[name=item]:checked')].map(x=>x.value),other:$('other').value,from:$('from').value,to:$('to').value,description:$('description').value,date:$('date').value,duration:$('duration').value,points};}
function setPick(value){pick=value;for(const key of ['from','to']){$(`pick-${key}`).classList.toggle('selected',pick===key);$(`pick-${key}`).setAttribute('aria-pressed',String(pick===key));}}
function updatePoints(){
  for(const key of ['from','to']) if(points[key]) $(`${key}-coords`).value=points[key].map(x=>x.toFixed(5)).join(', ');
  if(map){if(line)line.remove();if(points.from&&points.to)line=L.polyline([points.from,points.to],{color:'#244b3c',dashArray:'6 8',weight:2}).addTo(map);}
  $('map-status').textContent=points.from&&points.to?'Lähtö ja määränpää merkitty. Tarkista myös osoitteet.':points.from?'Lähtö merkitty. Valitse seuraavaksi määränpää.':'Valitse lähtö karttaa napsauttamalla.';
}
function place(key,coords){points[key]=coords;if(map){if(markers[key])markers[key].setLatLng(coords);else{markers[key]=L.marker(coords,{draggable:true,icon:L.divIcon({className:`map-pin ${key}`,html:key==='from'?'A':'B',iconSize:[30,30],iconAnchor:[15,15]}),title:key==='from'?'A · Lähtö':'B · Määränpää'}).addTo(map);markers[key].on('dragend',()=>{const p=markers[key].getLatLng();points[key]=[p.lat,p.lng];updatePoints();});}}updatePoints();}
function initMap(){if(map)return;if(!window.L){$('map-status').textContent='Kartta ei latautunut. Voit merkitä molemmat pisteet alla olevilla koordinaattikentillä.';form.querySelector('details').open=true;return;}map=L.map('map').setView([60.1699,24.9384],11);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map).on('tileerror',()=>{$('map-status').textContent='Karttapohjaa ei voitu ladata. Voit käyttää koordinaattikenttiä.';});map.on('click',e=>{place(pick,[e.latlng.lat,e.latlng.lng]);if(pick==='from')setPick('to');});for(const key of ['from','to'])if(points[key])place(key,points[key]);}
function show(){
  document.querySelectorAll('[data-step]').forEach(p=>p.hidden=Number(p.dataset.step)!==step);
  document.querySelectorAll('.steps li').forEach((li,i)=>{if(i===step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
  $('back').hidden=step===0;$('next').hidden=step===3;$('next').innerHTML=['Jatka tietoihin <span>→</span>','Valitse ajankohta <span>→</span>','Tarkista luonnos <span>→</span>',''][step];
  $('step-note').textContent=['Valitse Joukolle sopiva homma','Anna Joukolle joukko työn tietoja','Ehdota päivää Joukon kalenteriin','Joukon juoni koossa — luonnosta ei ole lähetetty'][step];
  $('error').textContent='';
  if(step===1){const transport=data().service==='transport';$('transport-fields').hidden=!transport;$('repair-fields').hidden=transport;if(transport){initMap();if(map)requestAnimationFrame(()=>map.invalidateSize());}}
  if(step===3)$('summary').textContent=bookingText(data());
  const heading=document.querySelector(`[data-step="${step}"] h3`)||$('booking-title');heading.tabIndex=-1;heading.focus({preventScroll:true});
}
function stepError(){const d=data();if(step===0)return d.service?'':'Valitse ensin palvelu.';if(step===1)return validateBooking({...d,date:localDate(),duration:1});return validateBooking(d);}
form.addEventListener('submit',e=>{e.preventDefault();const error=stepError();if(error){$('error').textContent=error;return;}if(step<3){step++;show();}});
$('back').addEventListener('click',()=>{if(step>0){step--;show();}});
for(const key of ['from','to'])$(`pick-${key}`).addEventListener('click',()=>setPick(key));
$('reset-map').addEventListener('click',()=>{for(const key of ['from','to']){points[key]=null;if(markers[key])markers[key].remove();delete markers[key];$(`${key}-coords`).value='';}setPick('from');updatePoints();});
$('apply-coords').addEventListener('click',()=>{const parsed={};for(const key of ['from','to']){const raw=$(`${key}-coords`).value.trim().split(/\s*,\s*/);const values=raw.map(Number);if(raw.length!==2||raw.some(x=>!x)||!values.every(Number.isFinite)||Math.abs(values[0])>85||Math.abs(values[1])>180){$('error').textContent='Anna molemmat pisteet muodossa leveysaste, pituusaste (−85…85, −180…180).';return;}parsed[key]=values;}for(const key of ['from','to'])place(key,parsed[key]);if(map)map.fitBounds([points.from,points.to],{padding:[35,35],maxZoom:14});$('error').textContent='';});
$('download').addEventListener('click',()=>{const blob=new Blob([bookingText(data())],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='jaas-varausluonnos.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('download-status').textContent='Varausluonnos ladattu. Sitä ei ole lähetetty Joukolle.';});
