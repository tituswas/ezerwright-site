import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('deployment config restricts sending to the approved server recipient',async()=>{
 const {contactDeploymentConfig}=await import('../scripts/prepare-contact-config.mjs');
 const config=await contactDeploymentConfig('owner@recipient.example');
 assert.deepEqual(config.send_email,[{name:'SEND_EMAIL',destination_address:'owner@recipient.example'}]);
 assert.equal(config.vars.CONTACT_TO,'owner@recipient.example');assert.equal(config.workers_dev,false);
 assert.deepEqual(config.ratelimits[0].simple,{limit:5,period:60});assert.ok(!config.unsafe);
 for(const address of ['','x\r\nBcc: y@evil.test','owner@example.invalid','owner@sample.test'])await assert.rejects(contactDeploymentConfig(address));
 const tracked=JSON.parse(await readFile('wrangler.contact.jsonc','utf8'));assert.equal(tracked.send_email[0].destination_address,'owner@example.invalid');
});
