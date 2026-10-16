import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,symlink,readFile,writeFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {adaptClient} from '../scripts/adapt.mjs';

// Exercise real Astro builds in disposable copies; no fixture can become a real listing.
test('published routes escape text, drafts stay private, production SEO and protections survive',async()=>{
  const config=JSON.parse(await readFile('src/config/production.json','utf8'));
  config.turnstileSiteKey='0xsyntheticFixtureKey';
  const parent=await mkdtemp(join(tmpdir(),'plugins-fixture-'));
  try{
    const target=join(parent,'source');await adaptClient(config,target);
    await symlink(resolve('node_modules'),join(target,'node_modules'),'dir');
    const plugin={status:'published',name:'Synthetic <script>alert(1)</script>',slug:'synthetic-only',summary:'A synthetic fixture; never released or shipped.',platforms:['Synthetic host'],prerequisites:['Test account'],permissions:['Read synthetic data'],dataPractices:'<img src=x onerror=alert(1)> stays plain text.',installation:['<script>alert(1)</script>','Synthetic next step'],links:{docs:'https://example.invalid/docs',source:'https://example.invalid/source',install:'https://example.invalid/install'},license:'MIT',version:'1.0.0',releaseDate:'2026-10-16'};
    await writeFile(join(target,'src/config/plugins.json'),JSON.stringify([plugin,{...plugin,status:'draft',slug:'private-draft'}]));
    const build=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:target,encoding:'utf8',env:{...process.env,SITE_CONFIG:'src/config/site.json',TURNSTILE_SITE_KEY:'0xsyntheticFixtureKey',ASTRO_TELEMETRY_DISABLED:'1'}});
    assert.equal(build.status,0,build.stdout+build.stderr);
    const html=await readFile(join(target,'dist/plugins/synthetic-only/index.html'),'utf8');
    const d=new JSDOM(html).window.document;
    assert.equal(d.querySelector('h1').textContent,plugin.name);
    assert.equal(d.querySelectorAll('main img,main script').length,0);
    assert.equal(d.querySelector('link[rel=canonical]').href,'https://ezerwright.com/plugins/synthetic-only/');
    assert.equal(d.querySelector('meta[name=robots]').content,'index, follow');
    for(const label of ['Compatibility','Before you install','Permissions','Data & security','Installation','Need a hand?'])assert.ok([...d.querySelectorAll('h2')].some(e=>e.textContent===label));
    const catalog=await readFile(join(target,'dist/plugins/index.html'),'utf8');
    assert.match(catalog,/\/plugins\/synthetic-only\//);assert.doesNotMatch(catalog,/private-draft|Catalog in preparation/);
    await assert.rejects(access(join(target,'dist/plugins/private-draft/index.html')));
    const sitemap=await readFile(join(target,'dist/sitemap.xml'),'utf8');assert.match(sitemap,/plugins\/synthetic-only\//);assert.doesNotMatch(sitemap,/private-draft/);
    const headers=await readFile(join(target,'dist/_headers'),'utf8');for(const text of ["frame-ancestors 'none'","form-action 'self'",'X-Frame-Options: DENY','Strict-Transport-Security'])assert.ok(headers.includes(text));
    assert.match(await readFile(join(target,'dist/_redirects'),'utf8'),/https:\/\/www.ezerwright.com/);
    const contact=await readFile(join(target,'dist/contact/index.html'),'utf8');assert.match(contact,/cf-turnstile/);assert.match(contact,/action="\/api\/contact"/);
    const services=JSON.parse(await readFile(join(target,'worker/generated-config.json'),'utf8')).services;assert.deepEqual(services,[...config.services.map(s=>s.id),'other']);
  }finally{await rm(parent,{recursive:true,force:true});}
});
test('client build excludes plugin routes, navigation and sitemap links',async()=>{
  const config=JSON.parse(await readFile('examples/exterior-demo.json','utf8'));
  const parent=await mkdtemp(join(tmpdir(),'plugins-client-'));
  try{
    const target=join(parent,'source');await adaptClient(config,target);await symlink(resolve('node_modules'),join(target,'node_modules'),'dir');
    const build=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:target,encoding:'utf8',env:{...process.env,SITE_CONFIG:'src/config/site.json',ASTRO_TELEMETRY_DISABLED:'1'}});
    assert.equal(build.status,0,build.stdout+build.stderr);
    await assert.rejects(access(join(target,'dist/plugins/index.html')));await assert.rejects(access(join(target,'dist/plugins/services/index.html')));
    for(const path of ['dist/index.html','dist/sitemap.xml'])assert.doesNotMatch(await readFile(join(target,path),'utf8'),/\/plugins\//);
  }finally{await rm(parent,{recursive:true,force:true});}
});
