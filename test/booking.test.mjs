import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBooking,bookingText,localDate} from '../booking.js';
const base={service:'transport',items:['Sohva'],other:'',from:'Helsinki',to:'Espoo',points:{from:[60,24],to:[61,25]},description:'Apua kaapin kokoamiseen',date:'2026-11-20',duration:'2'};
test('kuljetus tarvitsee kuorman, osoitteet ja karttapisteet',()=>{assert.equal(validateBooking(base,'2026-11-14'),'');for(const change of [{items:[]},{from:''},{to:''},{points:{from:null,to:null}}])assert.notEqual(validateBooking({...base,...change},'2026-11-14'),'');});
test('remontti ei tarvitse kuljetuksen tietoja',()=>{assert.equal(validateBooking({...base,service:'repair',items:[],from:'',to:'',points:{}},'2026-11-14'),'');assert.notEqual(validateBooking({...base,service:'repair',description:'lyhyt'},'2026-11-14'),'');});
test('päivä ja kesto tarkistetaan',()=>{for(const change of [{date:'2026-11-13'},{date:'2026-02-31'},{date:''},{duration:'0'},{duration:'100'}])assert.notEqual(validateBooking({...base,...change},'2026-11-14'),'');assert.equal(validateBooking({...base,date:'2026-11-14'},'2026-11-14'),'');});
test('luonnos kertoo että varausta ei lähetetty',()=>{const text=bookingText(base);assert.match(text,/Sohva/);assert.match(text,/Helsinki/);assert.match(text,/2 h/);assert.match(text,/ei ole lähetetty/);assert.equal(localDate(new Date(2026,0,2,23)),'2026-01-02');});
