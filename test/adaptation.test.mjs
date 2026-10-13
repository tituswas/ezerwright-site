import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const {adaptClient}=await import('../scripts/adapt.mjs').catch(()=>({}));
test('adapts a separate client copy without overwriting an existing destination',async()=>{assert.equal(typeof adaptClient,'function','client adaptation not implemented');const parent=await mkdtemp(join(tmpdir(),'agency-adapt-'));const target=join(parent,'client');try{const fixture=JSON.parse(await readFile('examples/exterior-demo.json','utf8'));await adaptClient(fixture,target);const saved=JSON.parse(await readFile(join(target,'src/config/site.json'),'utf8'));assert.equal(saved.template,'client');assert.equal(saved.name,'Exterior cleaning demo');assert.equal((await readFile(join(target,'src/config/offer.mjs'),'utf8')),await readFile('src/config/offer.mjs','utf8'));await assert.rejects(adaptClient(fixture,target));await assert.rejects(readFile(join(target,'.runtime/inbox.jsonl')));await assert.rejects(readFile(join(target,'node_modules/astro/package.json')));}finally{await rm(parent,{recursive:true,force:true});}});
