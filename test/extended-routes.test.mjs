import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateConfig} from '../src/config/validate.mjs';
import {site} from '../src/config/site.mjs';
import {offer} from '../src/config/offer.mjs';
const original=JSON.parse(await readFile('examples/exterior-demo.json','utf8'));
test('agency has five marketing pages plus separate privacy utility',()=>{
  assert.equal(site.pages.length,offer.marketingPages+1);
  assert.deepEqual(site.pages.map(p=>p.slug),['','services','approach','living','contact','privacy']);
  assert.equal(validateConfig(site).pages.length,6);
});
test('original client copy with four marketing pages remains supported',()=>{
  assert.equal(validateConfig(original).pages.length,5);
});
test('client may add a scoped fifth marketing page with configured sections',()=>{
  const extended=structuredClone(original);
  extended.pages.splice(3,0,{slug:'gallery',title:'Sample business gallery',description:'Client-approved project photos and captions.',sections:[{title:'Authorized work',text:'Only owner-supplied and licensed assets.'}]});
  assert.equal(validateConfig(extended).pages.length,6);
});
test('rejects duplicate, unsafe or unconfigured marketing slugs',()=>{
  for(const slug of ['../secrets','contact','privacy','bad\nname','<iframe>','Services']){
    const broken=structuredClone(original);
    broken.pages.splice(3,0,{slug,title:'New',description:'A sample page with suitable metadata.',sections:[{title:'Content',text:'Content'}]});
    assert.throws(()=>validateConfig(broken),`accepted unsafe slug ${slug}`);
  }
});
