import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const {packageHandoff}=await import('../scripts/package.mjs').catch(()=>({}));
test('packages portable source and build with verifiable hashes, no captures or dependencies',async()=>{assert.equal(typeof packageHandoff,'function','handoff packager missing');const parent=await mkdtemp(join(tmpdir(),'agency-package-'));try{const target=join(parent,'handoff');await packageHandoff(target);const manifest=JSON.parse(await readFile(join(target,'MANIFEST.json'),'utf8'));assert.ok(manifest.files['source/package-lock.json']);assert.ok(manifest.files['site/index.html']);for(const [name,record]of Object.entries(manifest.files)){const body=await readFile(join(target,name));assert.equal(body.length,record.bytes);assert.equal(createHash('sha256').update(body).digest('hex'),record.sha256);assert.doesNotMatch(name,/node_modules|\.runtime|\.env$|\.git\//);}await assert.rejects(packageHandoff(target));}finally{await rm(parent,{recursive:true,force:true});}});
