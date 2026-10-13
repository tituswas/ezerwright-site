import test from 'node:test';
import assert from 'node:assert/strict';
import {handleContact} from '../lib/contact.mjs';
import * as adapter from '../worker/adapter.mjs';
const settings={origin:'https://ezerwright.com',mode:'production',services:['website','other']};
const request=(changes={})=>new Request(settings.origin+'/api/contact',{method:'POST',headers:{Origin:settings.origin,Accept:'application/json','CF-Connecting-IP':'192.0.2.1'},body:new URLSearchParams({name:'QA only',email:'qa@example.test',business:'',service:'website',message:'A project enquiry',website:'','cf-turnstile-response':'qa-token',...changes})});
const env={CONTACT_FROM:'hello@ezerwright.com',CONTACT_TO:'qa@example.test',TURNSTILE_SECRET:'qa-only',RATE_LIMIT_SALT:'qa-only',CONTACT_RATE_LIMIT:{limit:async()=>({success:true})},SEND_EMAIL:{}};
test('contact responses include anti-framing policy and method metadata',async()=>{
 const r=await handleContact(new Request(settings.origin+'/api/contact',{headers:{Accept:'application/json'}}),settings,{});
 assert.equal(r.status,405);assert.equal(r.headers.get('Allow'),'POST');assert.equal(r.headers.get('X-Frame-Options'),'DENY');assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
});
test('rejects message control characters before accepting delivery',async()=>{
 let sent=false;const r=await handleContact(request({message:'bad\0message'}),settings,{allow:async()=>true,verify:async()=>true,deliver:async()=>{sent=true;}});
 assert.equal(r.status,400);assert.equal(sent,false);assert.ok((await r.json()).errors.message);
});
test('long Unicode enquiries produce valid bounded MIME lines',async()=>{
 let mail;const handler=adapter.createWorkerHandler(settings,{fetch:async()=>Response.json({success:true,hostname:'ezerwright.com',action:'contact'}),send:async(from,to,raw)=>{mail=raw;}});
 assert.equal((await handler(request({message:'文'.repeat(2000)}),env)).status,200);
 assert.match(mail,/^Date: /m);assert.match(mail,/^Message-ID: <[^>]+@ezerwright.com>\r$/m);
 const encoded=mail.split('\r\n\r\n')[1];for(const line of encoded.trim().split('\r\n'))assert.ok(line.length<=76,'MIME lines exceed 76 characters');
 assert.ok(Buffer.from(encoded.replace(/\r\n/g,''),'base64').toString('utf8').endsWith('文'.repeat(2000)));
});
test('standalone contact Worker handles API only, without a static asset binding',async()=>{
 assert.equal(typeof adapter.createContactRouter,'function');
 const router=adapter.createContactRouter(settings,{fetch:async()=>Response.json({success:true,hostname:'ezerwright.com',action:'contact'}),send:async()=>{}});
 assert.equal((await router(request(),env)).status,200);
 for(const path of ['/','/api/other','/api/contact/'])assert.equal((await router(new Request(settings.origin+path),env)).status,404);
});
test('provider errors, invalid actions and absent client address fail closed',async()=>{
 for(const kind of ['send-error','action','ip','verify-error']){
  let sends=0;const handler=adapter.createWorkerHandler(settings,{fetch:async()=>{if(kind==='verify-error')throw Error('Unavailable');return Response.json({success:true,hostname:'ezerwright.com',action:kind==='action'?'login':'contact'});},send:async()=>{sends++;throw Error('Unavailable');}});
  const req=request();if(kind==='ip')req.headers.delete('CF-Connecting-IP');const r=await handler(req,env);
  assert.equal(r.status,kind==='action'?400:kind==='ip'?429:503);assert.equal((await r.json()).ok,false);assert.equal(sends,kind==='send-error'?1:0);
 }
});
test('unconfigured Worker preserves an accessible native form failure',async()=>{
 const req=request();req.headers.set('Accept','text/html');const r=await adapter.createWorkerHandler(settings,{})(req,{});
 assert.equal(r.status,503);assert.match(r.headers.get('Content-Type'),/text\/html/);assert.equal(r.headers.get('X-Frame-Options'),'DENY');assert.match(await r.text(),/<main>.*contact service is not configured/);
});
