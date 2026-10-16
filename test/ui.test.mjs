import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';
async function page(response){const html=await readFile('dist/contact/index.html','utf8');const dom=new JSDOM(html,{url:'http://localhost/contact/?service='+site.services.at(-1).id,runScripts:'outside-only'});dom.window.fetch=async()=>response;const script=await readFile('public/ui.js','utf8').catch(()=>null);assert.ok(script,'UI enhancement missing');dom.window.eval(script);return dom;}
const wait=()=>new Promise(r=>setTimeout(r,10));
function populate(d){d.querySelector('[name=name]').value='Sample owner';d.querySelector('[name=email]').value='sample@example.test';d.querySelector('[name=message]').value='A useful website.';}
test('menu exposes expanded state and Escape returns focus',async()=>{const dom=await page();const d=dom.window.document;const b=d.querySelector('.menu-toggle');assert.equal(b.hidden,false);b.click();assert.equal(b.getAttribute('aria-expanded'),'true');dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(b.getAttribute('aria-expanded'),'false');assert.equal(d.activeElement,b);dom.window.close();});
test('valid query preselects only a configured service',async()=>{const dom=await page();assert.equal(dom.window.document.querySelector('[name=service]').value,site.services.at(-1).id);dom.window.close();});
test('failed submission preserves values and renders safe accessible errors',async()=>{const dom=await page({ok:false,json:async()=>({ok:false,message:'Please check the fields.',errors:{email:'<img src=x onerror=alert(1)>'}})});const d=dom.window.document;populate(d);d.querySelector('form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));await wait();assert.equal(d.querySelector('[name=name]').value,'Sample owner');assert.equal(d.querySelector('[name=email]').getAttribute('aria-invalid'),'true');assert.equal(d.querySelector('#form-errors').hidden,false);assert.equal(d.querySelector('#form-errors img'),null);assert.equal(d.querySelector('button[type=submit]').disabled,false);assert.equal(d.querySelector('#form-status').textContent,'');dom.window.close();});
test('success appears only after confirmed adapter response',async()=>{const dom=await page({ok:true,json:async()=>({ok:true,message:'Captured locally. No email was sent.'})});const d=dom.window.document;populate(d);d.querySelector('form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.equal(d.querySelector('button[type=submit]').disabled,true);await wait();assert.match(d.querySelector('#form-status').textContent,/No email/);assert.equal(d.querySelector('[name=name]').value,'');assert.equal(d.activeElement,d.querySelector('#form-status'));dom.window.close();});
test('a lost response preserves the enquiry and reports uncertain submission',async()=>{const dom=await page();dom.window.fetch=async()=>{throw new Error('Connection lost');};const d=dom.window.document;populate(d);d.querySelector('form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));await wait();assert.match(d.querySelector('#form-errors').textContent,/could not confirm whether/i);assert.doesNotMatch(d.querySelector('#form-errors').textContent,/was not submitted/i);assert.equal(d.querySelector('[name=message]').value,'A useful website.');assert.equal(d.querySelector('#form-status').textContent,'');assert.equal(d.querySelector('button[type=submit]').disabled,false);dom.window.close();});
test('header logo uses the existing vector asset independently of font glyph coverage',async()=>{
  const d=new JSDOM(await readFile('dist/contact/index.html','utf8')).window.document;
  const home=d.querySelector('.site-header .identity');
  assert.equal(home.getAttribute('aria-label'),`${site.name} home`);
  const symbol=home.querySelector('.identity-symbol');
  assert.equal(symbol.getAttribute('aria-hidden'),'true');
  const mark=symbol.querySelector('img');
  assert.ok(mark,'logo must use the existing font-independent vector asset');
  assert.equal(mark.getAttribute('src'),'/favicon.svg');
  assert.equal(mark.getAttribute('alt'),'');
  const icon=d.querySelector('.menu-toggle svg');
  assert.ok(icon,'menu icon must render independently of fullwidth-plus font support');
  assert.equal(icon.getAttribute('aria-hidden'),'true');
  assert.equal(icon.getAttribute('focusable'),'false');
});
