import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {offer} from '../src/config/offer.mjs';

test('current introductory pricing is conditional and never inherits the historical contract',async()=>{
 assert.deepEqual([offer.totalUSD,offer.depositUSD,offer.balanceUSD],[299,179,120]);
 async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+e.name;if(e.isDirectory())await walk(path);else if(path.endsWith('.html')){const d=new JSDOM(await readFile(path,'utf8')).window.document;assert.doesNotMatch(d.body.textContent,/\$(?:500|250)|two (?:consolidated )?revision rounds|five business days|fourteen.day defect/i,path);}}}
 await walk('dist');
 const d=new JSDOM(await readFile('dist/services/index.html','utf8')).window.document;
 assert.match(d.body.textContent,/eligibility.*confirmed in writing/i);
 assert.match(d.body.textContent,/domain.*hosting.*(?:separate|separately)/i);
});

test('blank required fields never trigger a network submission and errors clear on edit',async()=>{
 const dom=new JSDOM(await readFile('dist/contact/index.html','utf8'),{url:'http://localhost/contact/',runScripts:'outside-only'}),w=dom.window,d=w.document;
 let calls=0;w.fetch=async()=>{calls++;return {ok:false,json:async()=>({ok:false,message:'Please check',errors:{name:'Name is required.'}})}};
 w.eval(await readFile('public/ui.js','utf8'));
 d.querySelector('[name=name]').value=' \u00a0\u2003';d.querySelector('[name=email]').value='test@example.test';d.querySelector('[name=message]').value='A synthetic project';
 d.querySelector('form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 await new Promise(r=>setTimeout(r,10));assert.equal(calls,0);assert.equal(d.querySelector('[name=name]').getAttribute('aria-invalid'),'true');
 d.querySelector('[name=name]').value='José 王';d.querySelector('[name=name]').dispatchEvent(new w.Event('input',{bubbles:true}));
 assert.equal(d.querySelector('[name=name]').hasAttribute('aria-invalid'),false);assert.equal(d.querySelector('#error-name').hidden,true);
 dom.window.close();
});

test('changed copied assets have content-based URLs so returning visitors receive the release',async()=>{
 const {createHash}=await import('node:crypto');
 const d=new JSDOM(await readFile('dist/index.html','utf8')).window.document;
 for(const name of ['project-brief.js','project-room.js','director.css']){
  const expected=createHash('sha256').update(await readFile('public/'+name)).digest('hex').slice(0,12);
  const el=d.querySelector(`[src^="/${name}"],[href^="/${name}"]`);
  assert.equal(el.getAttribute('src')||el.getAttribute('href'),'/'+name+'?v='+expected,name);
 }
});

test('production privacy describes the observed hosting-layer performance beacon',async()=>{
 const c=JSON.parse(await readFile('src/config/production.json','utf8'));
 const text=c.privacySections.map(s=>s.text).join(' ');
 assert.match(text,/Cloudflare.*performance beacon/i);
 assert.doesNotMatch(text,/no advertising pixels, session replay or analytics scripts/i);
});
