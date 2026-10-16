import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,symlink,rm,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {adaptClient} from '../scripts/adapt.mjs';
test('Cloudflare Pages cannot accidentally publish the local demo configuration',()=>{
 const r=spawnSync(process.execPath,['scripts/build.mjs'],{encoding:'utf8',env:{...process.env,CF_PAGES:'1',SITE_CONFIG:'src/config/site.json'}});
 assert.notEqual(r.status,0);assert.match(r.stderr,/Cloudflare Pages requires the production configuration/);
});
test('authorized production candidate stays gated until a real challenge key exists',async()=>{
 const release=JSON.parse(await readFile('src/config/production.json','utf8'));
 assert.equal(release.origin,'https://ezerwright.com');assert.equal(release.email,'hello@ezerwright.com');
 assert.equal(release.mode,'production');assert.equal(release.privacyApproved,true);assert.equal(release.turnstileSiteKey,'');
 const r=spawnSync(process.execPath,['scripts/build.mjs'],{encoding:'utf8',env:{...process.env,SITE_CONFIG:'src/config/production.json',TURNSTILE_SITE_KEY:'',PRIVACY_APPROVED:''}});
 assert.notEqual(r.status,0);assert.match(r.stderr,/approved privacy content and a Turnstile site key/);
});
test('production build preserves SEO and CSP without unsupported host redirects',async()=>{
 const release=JSON.parse(await readFile('src/config/production.json','utf8'));
 const fixture={...release,privacyApproved:true,turnstileSiteKey:'0xLocalQANeverDeploy'};
 const parent=await mkdtemp(join(tmpdir(),'ezerwright-release-'));
 try{
  const target=join(parent,'source');await adaptClient(fixture,target);await symlink(resolve('node_modules'),join(target,'node_modules'),'dir');
  const build=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:target,encoding:'utf8',env:{...process.env,SITE_CONFIG:join(target,'src/config/site.json'),TURNSTILE_SITE_KEY:'',PRIVACY_APPROVED:''}});
  assert.equal(build.status,0,build.stdout+build.stderr);
  const headers=await readFile(join(target,'dist/_headers'),'utf8');
  assert.match(headers,/X-Frame-Options: DENY/);assert.match(headers,/Strict-Transport-Security: max-age=31536000/);assert.match(headers,/frame-ancestors 'none'/);
  for(const page of fixture.pages){
   const html=await readFile(join(target,'dist',page.slug,'index.html'),'utf8');
   assert.doesNotMatch(html,/Private demonstration|example\.invalid|ezerwright\.test|synthetic test|Send test enquiry|Demo privacy|preparing practical/i);
   const d=new JSDOM(html).window.document;
   assert.equal(d.title.split('EZERWRIGHT').length-1,1);assert.equal(d.querySelector('meta[name=robots]').content,'index, follow');
   for(const script of d.querySelectorAll('script:not([src])'))assert.ok(headers.includes(createHash('sha256').update(script.textContent).digest('base64')),'inline script missing from CSP');
  }
  await assert.rejects(access(join(target,'dist/_redirects')),{code:'ENOENT'},'host redirects belong in Cloudflare account rules, never a global path fallback');
  assert.match(await readFile(join(target,'dist/robots.txt'),'utf8'),/Allow: \/\nSitemap: https:\/\/ezerwright.com\/sitemap.xml/);
  const html=await readFile(join(target,'dist/contact/index.html'),'utf8');assert.match(html,/JavaScript.*spam verification/);assert.match(html,/mailto:hello@ezerwright.com/);
 }finally{await rm(parent,{recursive:true,force:true});}
});
