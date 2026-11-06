import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
const html=await readFile('dist/index.html','utf8');
async function setup(reduced=false){
 const dom=new JSDOM(html,{url:'https://ezerwright.com/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.matchMedia=()=>({matches:reduced,addEventListener(){}});w.fetch=()=>{throw Error('Gallery must never submit');};
 let clock=1000;Object.defineProperty(w.performance,'now',{value:()=>clock});
 w.eval(await readFile('public/work-gallery.js','utf8'));
 const d=w.document,deck=d.querySelector('[data-showcase]');
 const selected=()=>d.querySelector('[data-work-panel]:not([hidden])');
 const wheel=(deltaY,target=deck,options={})=>{const e=new w.WheelEvent('wheel',{deltaY,bubbles:true,cancelable:true,...options});target.dispatchEvent(e);return e;};
 return{dom,w,d,deck,selected,wheel,tick:(n=500)=>clock+=n};
}
test('original website panels retain all three real concept routes before JavaScript',()=>{
 const d=new JSDOM(html).window.document;
 assert.equal(d.querySelectorAll('[data-work-panel]').length,3);assert.equal(d.querySelectorAll('[data-work-panel][hidden]').length,0);
 assert.equal(d.querySelectorAll('h1').length,1);assert.ok(d.querySelector('img[src="/art/living-garden.webp"]'));
 assert.match(d.querySelector('[data-work-panel] h2').textContent,/Thoughtful landscapes for everyday living/);
 for(const key of ['landscape','pool','exterior'])assert.ok(d.querySelector(`[data-work-panel=${key}] a[href="/showcase/${key}/"]`));
 assert.ok(d.querySelector('#project-brief'));assert.equal(d.querySelector('.journey-studio'),null);
});
test('wheel is local, releases both boundaries, supports immediate reversal and trackpad deltas',async()=>{
 const s=await setup(),{d,deck,selected,wheel,tick,dom}=s;
 assert.equal(selected().dataset.workPanel,'landscape');assert.equal(wheel(-80).defaultPrevented,false,'top boundary releases upward');
 assert.equal(wheel(80,d.querySelector('.studio-hero-copy')).defaultPrevented,false,'outside the panel stays native');
 assert.equal(wheel(80,deck,{ctrlKey:true}).defaultPrevented,false,'browser zoom stays native');
 assert.equal(wheel(80).defaultPrevented,true);assert.equal(selected().dataset.workPanel,'pool');
 wheel(80);assert.equal(selected().dataset.workPanel,'pool','one gesture does not race through slides');
 wheel(-80);assert.equal(selected().dataset.workPanel,'landscape','reverse direction responds within the same gesture');
 tick();for(let i=0;i<8;i++){tick(20);wheel(5);}assert.equal(selected().dataset.workPanel,'pool','small trackpad events accumulate');
 tick();wheel(80);assert.equal(selected().dataset.workPanel,'exterior');assert.equal(wheel(80).defaultPrevented,false,'last design releases downward');
 assert.equal(d.querySelectorAll('[data-work-panel]:not([hidden])').length,1);assert.equal(d.querySelectorAll('[data-work-panel][inert]').length,2);
 assert.equal(d.querySelectorAll('.project-brief').length,1);assert.equal(d.querySelectorAll('.contact-form').length,0);
 dom.window.close();
});
test('buttons, focused keyboard and reduced motion all reach every design without capture',async()=>{
 const {dom,w,d,deck,selected}=await setup(true);
 d.querySelector('[data-work-next]').click();assert.equal(selected().dataset.workPanel,'pool');
 d.querySelector('[data-work-next]').click();assert.equal(selected().dataset.workPanel,'exterior');assert.equal(d.querySelector('[data-work-next]').disabled,true);
 d.querySelector('[data-work-prev]').click();assert.equal(selected().dataset.workPanel,'pool');
 deck.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));assert.equal(selected().dataset.workPanel,'landscape');
 for(const key of ['ArrowRight','ArrowDown'])deck.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));assert.equal(selected().dataset.workPanel,'exterior');
 assert.equal(deck.classList.contains('is-turning'),false,'reduced motion changes content without animation');
 const link=selected().querySelector('a');link.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal(selected().dataset.workPanel,'exterior','child link retains native keyboard behavior');
 assert.match(d.querySelector('[data-work-status]').textContent,/3 of 3/);dom.window.close();
});
test('horizontal swipe selects a design while vertical touch remains native',async()=>{
 const {dom,w,deck,selected}=await setup();
 const touch=(type,x,y)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,type==='touchstart'?'touches':'changedTouches',{value:[{clientX:x,clientY:y}]});deck.dispatchEvent(e);assert.equal(e.defaultPrevented,false);};
 touch('touchstart',200,200);touch('touchend',190,70);assert.equal(selected().dataset.workPanel,'landscape');
 touch('touchstart',200,200);touch('touchend',100,190);assert.equal(selected().dataset.workPanel,'pool');
 touch('touchstart',100,200);touch('touchend',210,190);assert.equal(selected().dataset.workPanel,'landscape');dom.window.close();
});

test('long trackpad momentum advances once until a fresh gesture, with immediate reversal',async()=>{
 const {dom,wheel,tick,selected}=await setup();
 wheel(80);assert.equal(selected().dataset.workPanel,'pool');
 for(let i=0;i<30;i++){tick(60);assert.equal(wheel(12).defaultPrevented,true);}
 assert.equal(selected().dataset.workPanel,'pool','continuous momentum lasting beyond 420ms must not advance twice');
 tick(181);wheel(80);assert.equal(selected().dataset.workPanel,'exterior','a quiet interval starts the next gesture');
 assert.equal(wheel(12).defaultPrevented,false,'momentum releases at the final design');
 wheel(-80);assert.equal(selected().dataset.workPanel,'pool','reversal bypasses the previous gesture latch');
 for(let i=0;i<8;i++){tick(50);wheel(-12);}assert.equal(selected().dataset.workPanel,'pool');
 tick(181);wheel(-80);assert.equal(selected().dataset.workPanel,'landscape');assert.equal(wheel(-12).defaultPrevented,false);dom.window.close();
});
test('switching while a concept link has focus moves focus before hiding its panel',async()=>{
 const {dom,d,deck,selected,wheel,tick}=await setup();
 const old=selected(),link=old.querySelector('a');link.focus();assert.equal(d.activeElement,link);
 const hide=old.toggleAttribute.bind(old);old.toggleAttribute=(name,force)=>{if(name==='inert'&&force)assert.equal(d.activeElement,deck,'focus leaves before the outgoing panel becomes inert');return hide(name,force);};
 wheel(80);assert.equal(old.hidden,true);assert.equal(d.activeElement,deck);
 const active=selected().querySelector('a');active.focus();tick();d.querySelector('[data-work-next]').click();assert.equal(d.activeElement,deck);assert.equal(selected().contains(d.activeElement),false);dom.window.close();
});
test('photo-backed website headings retain a white foreground above agency heading defaults',async()=>{
 const css=await readFile('public/living-studio.css','utf8');
 assert.match(css,/\.agency-experience \.website-copy h2\{color:#fff\}/);
});
