import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,symlink,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {adaptClient} from '../scripts/adapt.mjs';

test('Cloudflare branch preview is noindex, non-submitting and cannot impersonate production',async()=>{
 const defaultSite=JSON.parse(await readFile('src/config/site.json','utf8'));
 const parent=await mkdtemp(join(tmpdir(),'ezer-preview-'));
 const target=join(parent,'source');
 try{
  await adaptClient(defaultSite,target);
  await symlink(resolve('node_modules'),join(target,'node_modules'),'dir');
  const base={...process.env,ASTRO_TELEMETRY_DISABLED:'1',CF_PAGES:'1',SITE_CONFIG:'src/config/site.json',TURNSTILE_SITE_KEY:'0xFakeKeyMustNotEnterPreview'};
  const preview={...base,CF_PAGES_BRANCH:'feature/cinematic-agency-experience-20261030',CF_PAGES_URL:'https://review-abc.ezerwright-site.pages.dev'};
  const run=env=>spawnSync(process.execPath,['scripts/build.mjs'],{cwd:target,env,encoding:'utf8'});
  const build=run(preview);
  assert.equal(build.status,0,build.stdout+build.stderr);
  const home=new JSDOM(await readFile(join(target,'dist/index.html'),'utf8')).window.document;
  assert.equal(home.querySelector('meta[name="robots"]')?.getAttribute('content'),'noindex, nofollow');
  assert.equal(home.querySelector('link[rel="canonical"]')?.getAttribute('href'),'https://review-abc.ezerwright-site.pages.dev/');
  assert.match(home.body.textContent,/Design preview.*Forms disabled/);
  assert.match(home.querySelector('h1')?.textContent||'',/website that feels ahead/i);
  const contact=new JSDOM(await readFile(join(target,'dist/contact/index.html'),'utf8')).window.document;
  assert.equal(contact.querySelectorAll('form').length,0,'preview must never capture enquiries');
  assert.equal(contact.querySelectorAll('script[src*="turnstile"]').length,0);
  assert.match(contact.body.textContent,/Enquiries are disabled on this preview/i);
  assert.ok(contact.querySelector('a[href="https://ezerwright.com/contact/"]'));
  const privacy=await readFile(join(target,'dist/privacy/index.html'),'utf8');
  assert.match(privacy,/No submissions on this preview/);
  assert.doesNotMatch(privacy,/Synthetic submissions are written to a local capture file/);
  const robots=await readFile(join(target,'dist/robots.txt'),'utf8');
  assert.match(robots,/Disallow: \//);
  const sitemap=await readFile(join(target,'dist/sitemap.xml'),'utf8');
  assert.match(sitemap,/https:\/\/review-abc\.ezerwright-site\.pages\.dev\/showcase\/pool\//);

  // The preview branch must not be allowed to claim an arbitrary destination.
  const foreign=run({...preview,CF_PAGES_URL:'https://ezerwright.com'});
  assert.notEqual(foreign.status,0);
  assert.match(foreign.stderr,/requires a valid ezerwright-site.pages.dev deployment URL/);

  // The production branch cannot accidentally publish the demo build.
  const mainDemo=run({...preview,CF_PAGES_BRANCH:'main'});
  assert.notEqual(mainDemo.status,0);
  assert.match(mainDemo.stderr,/requires the production configuration/);

  // Production remains blocked without the real challenge configuration.
  const mainWithoutKey=run({...preview,CF_PAGES_BRANCH:'main',SITE_CONFIG:'src/config/production.json',TURNSTILE_SITE_KEY:''});
  assert.notEqual(mainWithoutKey.status,0);
  assert.match(mainWithoutKey.stderr,/approved privacy content and a Turnstile site key/);
 }finally{
  await rm(parent,{recursive:true,force:true});
 }
});
