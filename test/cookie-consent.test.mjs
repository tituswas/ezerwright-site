import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

const consentScript=await readFile('public/cookie-consent.js','utf8');
const uiScript=await readFile('public/ui.js','utf8');
const key='ezerwright-cookie-choice-v1';
const policy='2026-11-25-no-optional-services';
const wait=()=>new Promise(resolve=>setTimeout(resolve,0));
async function makePage(saved,storageFails=false){
 const dom=new JSDOM(await readFile('dist/index.html','utf8'),{url:'https://ezerwright.com/',runScripts:'outside-only'});
 const w=dom.window;
 if(saved!==undefined)w.localStorage.setItem(key,JSON.stringify(saved));
 if(storageFails)Object.defineProperty(w,'localStorage',{get(){throw Error('Storage blocked');}});
 const requests=[];w.fetch=(...args)=>{requests.push(args);throw Error('Unexpected network call');};
 w.navigator.sendBeacon=(...args)=>{requests.push(args);return true;};
 w.eval(consentScript);
 return {dom,w,d:w.document,requests};
}
test('an undecided visit performs no optional network or storage write',async()=>{
 const {dom,w,d,requests}=await makePage();
 assert.equal(w.localStorage.length,0);
 assert.equal(d.querySelector('[data-cookie-panel]').hidden,false);
 assert.equal(d.documentElement.dataset.optionalTracking,'off');
 assert.equal(d.querySelectorAll('script[src^="https:"]').length,0);
 assert.deepEqual(requests,[]);dom.window.close();
});
test('accept and reject persist only the necessary preference and load no trackers',async()=>{
 for(const choice of ['accepted','rejected']){
  const {dom,w,d,requests}=await makePage();
  d.querySelector(`[data-cookie-choice="${choice}"]`).click();
  const saved=JSON.parse(w.localStorage.getItem(key));
  assert.deepEqual(Object.keys(saved).sort(),['at','choice','policy']);
  assert.equal(saved.choice,choice);assert.equal(saved.policy,policy);
  assert.equal(w.localStorage.length,1);assert.equal(d.cookie,'');
  assert.equal(d.querySelector('[data-cookie-panel]').hidden,true);
  assert.equal(d.documentElement.dataset.optionalTracking,'off');
  assert.equal(d.querySelectorAll('script[src^="https:"]').length,0);assert.deepEqual(requests,[]);
  const reloaded=await makePage(saved);
  assert.equal(reloaded.d.querySelector('[data-cookie-panel]').hidden,true);
  reloaded.dom.window.close();dom.window.close();
 }
});
test('settings withdrawal changes the choice without clearing useful page state',async()=>{
 const {dom,w,d,requests}=await makePage({policy,choice:'accepted',at:Date.now()});
 w.localStorage.setItem('unrelated-requested-feature','preserve');
 d.querySelector('[data-cookie-settings]').click();
 assert.equal(d.querySelector('[data-cookie-panel]').hidden,false);
 assert.equal(d.activeElement.id,'cookie-title');
 d.querySelector('[data-cookie-choice="rejected"]').click();
 assert.equal(JSON.parse(w.localStorage.getItem(key)).choice,'rejected');
 assert.equal(w.localStorage.getItem('unrelated-requested-feature'),'preserve');
 assert.equal(d.activeElement,d.querySelector('[data-cookie-settings]'));
 assert.deepEqual(requests,[]);dom.window.close();
});
test('expired, future, changed policy and corrupted preferences never grant consent',async()=>{
 for(const saved of [{policy,choice:'accepted',at:Date.now()-181*86400000},{policy,choice:'accepted',at:Date.now()+86400000},{policy:'future-provider',choice:'accepted',at:Date.now()},{policy,choice:'yes',at:Date.now()},null]){
  const {dom,d}=await makePage(saved);
  assert.equal(d.querySelector('[data-cookie-panel]').hidden,false);
  assert.equal(d.documentElement.dataset.optionalTracking,'off');dom.window.close();
 }
});
test('blocked storage leaves optional tracking off and explains the unsaved choice',async()=>{
 const {dom,d,requests}=await makePage(undefined,true);
 d.querySelector('[data-cookie-choice="accepted"]').click();
 assert.equal(d.querySelector('[data-cookie-panel]').hidden,false);
 assert.match(d.querySelector('[data-cookie-status]').textContent,/could not save/);
 assert.equal(d.documentElement.dataset.optionalTracking,'off');assert.deepEqual(requests,[]);dom.window.close();
});
test('cross-tab changes and back-forward navigation recheck the preference',async()=>{
 const {dom,w,d}=await makePage({policy,choice:'accepted',at:Date.now()});
 w.localStorage.removeItem(key);w.dispatchEvent(new w.StorageEvent('storage',{key}));
 assert.equal(d.querySelector('[data-cookie-panel]').hidden,false);
 w.localStorage.setItem(key,JSON.stringify({policy,choice:'rejected',at:Date.now()}));
 w.dispatchEvent(new w.PageTransitionEvent('pageshow',{persisted:true}));
 assert.equal(d.querySelector('[data-cookie-panel]').hidden,true);dom.window.close();
});
async function makeContact(){
 const dom=new JSDOM(await readFile('dist/contact/index.html','utf8'),{url:'https://ezerwright.com/contact/',runScripts:'outside-only'});
 const w=dom.window,d=w.document,form=d.querySelector('.contact-form');
 // The ordinary local build is demo-only; exercise the production gate with synthetic data.
 form.insertAdjacentHTML('beforeend','<div data-security-check data-sitekey="0xSynthetic"><button type="button" data-enable-security>Enable spam verification</button><div data-turnstile-container hidden></div><p data-security-status role="status"></p></div>');
 const requests=[];w.fetch=async(...args)=>{requests.push(args);return {ok:true,json:async()=>({ok:true,message:'Synthetic capture only'})};};
 w.eval(uiScript);return {dom,w,d,form,requests};
}
test('the spam-check script loads only after the explicit security action',async()=>{
 const {dom,w,d,form,requests}=await makeContact();
 assert.equal(d.querySelectorAll('script[src*="challenges.cloudflare.com"]').length,0);
 form.querySelector('[name=name]').value='QA only';form.querySelector('[name=email]').value='qa@example.test';form.querySelector('[name=message]').value='Synthetic only';
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));await wait();
 assert.equal(requests.length,0);assert.match(d.querySelector('#form-errors').textContent,/Enable spam verification/);
 assert.equal(d.querySelectorAll('script[src*="challenges.cloudflare.com"]').length,0);
 const enable=d.querySelector('[data-enable-security]');enable.click();enable.click();
 const scripts=d.querySelectorAll('script[src*="challenges.cloudflare.com"]');assert.equal(scripts.length,1);assert.match(scripts[0].src,/render=explicit/);
 let options;
 w.turnstile={ready:callback=>callback(),render:(container,value)=>{options=value;container.insertAdjacentHTML('beforeend','<input type="hidden" name="cf-turnstile-response" value="synthetic-token">');return 'fixture-widget';},reset:()=>{}};
 scripts[0].dispatchEvent(new w.Event('load'));await wait();
 assert.equal(options.action,'contact');assert.equal(options.sitekey,'0xSynthetic');
 assert.equal(d.querySelector('[data-turnstile-container]').hidden,false);assert.equal(enable.hidden,true);
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));await wait();
 assert.equal(requests.length,1);assert.equal(requests[0][0],'https://ezerwright.com/api/contact');
 assert.match(String(requests[0][1].body),/cf-turnstile-response=synthetic-token/);dom.window.close();
});
test('a blocked security script permits a retry and never sends the enquiry',async()=>{
 const {dom,w,d,requests}=await makeContact();
 d.querySelector('[data-enable-security]').click();
 d.querySelector('script[src*="challenges.cloudflare.com"]').dispatchEvent(new w.Event('error'));await wait();
 assert.equal(d.querySelector('[data-enable-security]').disabled,false);
 assert.equal(d.querySelectorAll('script[src*="challenges.cloudflare.com"]').length,0);
 assert.match(d.querySelector('[data-security-status]').textContent,/could not load/);assert.equal(requests.length,0);dom.window.close();
});
test('the release blocks injected analytics, same-origin rum and browser error reporting',async()=>{
 const headers=await readFile('dist/_headers','utf8');
 const csp=headers.split('\n').find(line=>line.includes('Content-Security-Policy:'));
 assert.doesNotMatch(csp,/cloudflareinsights|connect-src 'self'|\*|unsafe-eval/);
 assert.match(csp,/connect-src https:\/\/ezerwright\.test\/api\/contact https:\/\/challenges\.cloudflare\.com;/);
 assert.match(headers,/NEL: \{"report_to":"cf-nel","max_age":0\}/);
 assert.match(headers,/Report-To: \{"group":"cf-nel","max_age":0,"endpoints":\[\]\}/);
 for(const route of ['/','/index.html','/contact/','/contact/index.html','/privacy/','/office-bid-studio/'])assert.ok(headers.includes(route+'\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n'),route);
 assert.match(headers,/Referrer-Policy: no-referrer/);
});
