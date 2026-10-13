import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {once} from 'node:events';
import {createDemoServer} from '../scripts/demo-server.mjs';
import {site} from '../src/config/site.mjs';
test('real HTTP server serves built pages and writes one synthetic enquiry',async()=>{const dir=await mkdtemp(join(tmpdir(),'agency-http-'));const inbox=join(dir,'inbox.jsonl');const server=createDemoServer({inbox});server.listen(0,'127.0.0.1');await once(server,'listening');const origin=`http://127.0.0.1:${server.address().port}`;try{for(const route of site.pages.map(p=>p.slug?'/'+p.slug+'/':'/')){const r=await fetch(origin+route);assert.equal(r.status,200);assert.match(r.headers.get('Content-Type'),/html/);}const response=await fetch(origin+'/api/contact',{method:'POST',headers:{Origin:origin,Accept:'application/json'},body:new URLSearchParams({name:'Synthetic test',email:'synthetic@example.test',business:'QA example',service:site.services[0].id,message:'Testing local capture.',website:''})});assert.equal(response.status,200);assert.equal((await response.json()).delivery,'local-capture');const lines=(await readFile(inbox,'utf8')).trim().split('\n');assert.equal(lines.length,1);assert.equal(JSON.parse(lines[0]).name,'Synthetic test');assert.equal((await fetch(origin+'/.env')).status,404);assert.equal((await fetch(origin+'/%2e%2e%2flib/contact.mjs')).status,403);}finally{server.close();await once(server,'close');await rm(dir,{recursive:true,force:true});}});
