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
