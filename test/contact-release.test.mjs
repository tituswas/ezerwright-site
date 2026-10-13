import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
test('contact production settings are independent of generated demo settings',async()=>{
 const {productionSettings}=await import('../worker/production-settings.mjs');
 const content=JSON.parse(await readFile('src/config/production.json','utf8'));
 assert.equal(productionSettings.mode,'production');assert.equal(productionSettings.origin,'https://ezerwright.com');
 assert.deepEqual(productionSettings.services,[...content.services.map(s=>s.id),'other']);
 assert.doesNotMatch(await readFile('worker/contact.mjs','utf8'),/generated-config/);
});
test('contact deployment prepares from source even when a demo build was the last build',async()=>{
 const parent=await mkdtemp(join(tmpdir(),'contact-release-'));
 try{
  await writeFile(join(parent,'generated-config.json'),JSON.stringify({mode:'demo',origin:'https://ezerwright.test'}));
  const r=spawnSync(process.execPath,[resolve('scripts/prepare-contact-config.mjs')],{cwd:parent,encoding:'utf8',env:{...process.env,CONTACT_TO:'owner@recipient.example'}});
  assert.equal(r.status,0,r.stdout+r.stderr);
  const config=JSON.parse(await readFile(join(parent,'.wrangler/contact-deploy.json'),'utf8'));
  assert.equal(config.main,resolve('worker/contact.mjs'));
  assert.equal(config.send_email[0].destination_address,'owner@recipient.example');
  assert.equal(config.vars.CONTACT_TO,'owner@recipient.example');
 }finally{await rm(parent,{recursive:true,force:true});}
});
