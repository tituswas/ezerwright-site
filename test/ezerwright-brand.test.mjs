import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validateConfig} from '../src/config/validate.mjs';
const config=JSON.parse(readFileSync(new URL('../src/config/site.json',import.meta.url),'utf8'));
test('selected brand is EZERWRIGHT, not the prior candidate',()=>{
 assert.equal(config.name,'EZERWRIGHT');
 for (const p of config.pages) assert.match(p.title,/EZERWRIGHT/);
 assert.ok(!JSON.stringify(config).includes('DAVARENTO'));
});
test('private candidate cannot silently accept production inquiries',()=>{
 assert.equal(config.mode,'demo');
 assert.equal(config.productionApproved,false);
 assert.equal(config.email,'hello@example.invalid');
 assert.equal(config.origin,'https://ezerwright.test');
 assert.doesNotThrow(()=>validateConfig(config));
});
test('starter commercial terms unchanged',()=>{
 const text=JSON.stringify(config);
 assert.match(text,/\$500/);
 assert.match(text,/\$250/);
 assert.match(text,/two revision rounds/i);
 assert.equal(config.pages.length,6);
});
