import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';

// Removing validation or publishing drafts must break these checks.
const fixture=()=>({status:'published',name:'Synthetic test plugin',slug:'synthetic-test',summary:'Synthetic fixture only; never a shipped listing.',platforms:['Synthetic host'],prerequisites:['Synthetic account'],permissions:['Read synthetic records'],dataPractices:'Synthetic data stays local.',installation:['Review permissions.','Install from the synthetic link.'],links:{docs:'https://example.invalid/docs',source:'https://example.invalid/source',install:'https://example.invalid/install'},license:'MIT',version:'1.0.0',releaseDate:'2026-10-16'});
test('manifest is empty and validates entries before publishing',async()=>{
  const {validatePlugins,publishedPlugins}=await import('../src/config/plugins.mjs');
  assert.deepEqual(publishedPlugins,[]);
  assert.deepEqual(validatePlugins([]),[]);
  assert.equal(validatePlugins([fixture()]).length,1);
  assert.throws(()=>validatePlugins({}));
  for(const slug of ['services','../private','bad/route','Bad','%2f','a'.repeat(81)])assert.throws(()=>validatePlugins([{...fixture(),slug}]));
  assert.throws(()=>validatePlugins([fixture(),fixture()]));
  for(const status of [undefined,'ready',true])assert.throws(()=>validatePlugins([{...fixture(),status}]));
  for(const field of ['name','summary','platforms','prerequisites','permissions','dataPractices','installation','license','version','releaseDate']){
    const entry=fixture();delete entry[field];assert.throws(()=>validatePlugins([entry]),field);
  }
  for(const releaseDate of ['2026-02-30','yesterday','2026-13-01'])assert.throws(()=>validatePlugins([{...fixture(),releaseDate}]));
  for(const url of ['javascript:alert(1)','data:text/html,test','//evil.test','http://example.invalid','https://user:pass@example.invalid','https://example.invalid/\n'])for(const key of ['docs','source','install'])assert.throws(()=>validatePlugins([{...fixture(),links:{...fixture().links,[key]:url}}]));
  assert.throws(()=>validatePlugins([{...fixture(),status:'draft',slug:'../private'}]));
});
test('catalog and services are separate static routes with correct SEO and honest copy',async()=>{
  const agency=site.template!=='client';
  if(!agency)return;
  for(const slug of ['plugins','plugins/services']){
    const html=await readFile(`dist/${slug}/index.html`,'utf8');
    const d=new JSDOM(html).window.document;
    assert.equal(d.querySelectorAll('h1').length,1);
    assert.equal(d.querySelector('link[rel=canonical]').href,`${site.origin}/${slug}/`);
    assert.equal(d.querySelector('meta[name=robots]').content,site.mode==='demo'?'noindex, nofollow':'index, follow');
    assert.ok(d.querySelector('a[href="/contact/"]'));
    assert.equal(d.querySelector('nav[aria-label="Main navigation"] a[aria-current]').textContent,'Plugins');
    assert.doesNotMatch(html,/\b(?:API_SECRET|TURNSTILE_SECRET|SMTP_PASSWORD)\b/);
  }
  const catalog=await readFile('dist/plugins/index.html','utf8');
  assert.match(catalog,/Catalog in preparation/);
  assert.deepEqual((await readdir('dist/plugins')).sort(),['index.html','services']);
  const sitemap=await readFile('dist/sitemap.xml','utf8');
  assert.match(sitemap,/<loc>https:\/\/[^<]+\/plugins\/<\/loc>/);
  assert.match(sitemap,/<loc>https:\/\/[^<]+\/plugins\/services\/<\/loc>/);
  assert.equal(site.pages.length,6);
});

test('demo agency routes retain notices, noindex and demo contact boundaries',async()=>{
  if(site.mode!=='demo'||site.template==='client')return;
  for(const slug of [...site.pages.map(page=>page.slug),'plugins','plugins/services']){
    const d=new JSDOM(await readFile(`dist/${slug?slug+'/':''}index.html`,'utf8')).window.document;
    assert.match(d.querySelector('.demo-banner').textContent,/Private demonstration.*Sample information only/);
    assert.match(d.querySelector('.footer-note').textContent,/Private demonstration only/);
    assert.equal(d.querySelector('meta[name=robots]').content,'noindex, nofollow');
    assert.equal(d.querySelector('nav[aria-label="Main navigation"] a[href="/plugins/"]').textContent,'Plugins');
    assert.equal(d.querySelector('nav[aria-label="Footer navigation"] a[href="/plugins/"]').textContent,'Plugins');
  }
  const contact=await readFile('dist/contact/index.html','utf8');
  assert.match(contact,/Use synthetic details only/);
  assert.match(contact,/captures locally and sends no email/);
  assert.match(await readFile('dist/robots.txt','utf8'),/Disallow: \//);
});

test('plugin catalog cross-links match the cinematic teal identity, not default blue',async()=>{
 if(site.template==='client')return;
 const html=await readFile('dist/plugins/index.html','utf8');
 const d=new JSDOM(html).window.document;
 const links=[...d.querySelectorAll('.plugin-crosslinks a')];
 assert.equal(links.length,2);
 assert.equal(links[0].getAttribute('href'),'/services/');
 assert.equal(links[1].getAttribute('href'),'/contact/');
 const css=await readFile('src/styles/plugins.css','utf8');
 assert.match(css,/\.plugins \.plugin-crosslinks a\{color:#145448/);
 assert.match(css,/\.plugins \.plugin-crosslinks a:hover\{color:#08715b/);
 assert.match(css,/\.plugins \.plugin-crosslinks a:focus-visible\{outline:3px solid #147c65/);
});
