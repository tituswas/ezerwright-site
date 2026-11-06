import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';

test('Living Studio homepage offers transparent commercial terms and real routes',async()=>{
 if(site.template==='client')return;
 const html=await readFile('dist/index.html','utf8');
 const doc=new JSDOM(html).window.document;
 assert.match(doc.querySelector('h1')?.textContent||'',/Good businesses.*deserve.*extraordinary.*websites/i);
 assert.match(doc.body.textContent,/US\$500/);
 assert.match(doc.body.textContent,/\$250 to start/);
 assert.equal(doc.querySelectorAll('.website-panel a[href^="/showcase/"]').length,3);
 assert.ok(doc.querySelector('a[href="/contact/"]'));
 assert.match(html,/FICTIONAL INTERACTIVE CONCEPT/);
});

test('all three fictional concepts have one H1, usable service selectors, no capture form',async()=>{
 if(site.template==='client')return;
 for(const slug of ['exterior','pool','landscape']){
  const html=await readFile('dist/showcase/'+slug+'/index.html','utf8');
  const doc=new JSDOM(html).window.document;
  assert.equal(doc.querySelectorAll('h1').length,1);
  assert.equal(doc.querySelectorAll('button[data-option]').length,3);
  assert.equal(doc.querySelectorAll('button[data-option][aria-pressed="true"]').length,1);
  assert.ok(doc.querySelector('[data-selected-service]'));
  assert.equal(doc.querySelectorAll('form').length,0);
  assert.match(doc.body.textContent,/FICTIONAL BUSINESS/);
  assert.ok(doc.querySelector('a[href="/contact/?service=website"]'));
 }
});

test('animation sources explicitly respect reduced motion',async()=>{
 const homeCss=await readFile('public/cinematic-home.css','utf8');
 const demo=await readFile('src/pages/showcase/[slug].astro','utf8');
 assert.match(homeCss,/prefers-reduced-motion:reduce/);
 assert.match(demo,/prefers-reduced-motion:reduce/);
});

test('all agency interior routes sustain Living Studio without changing existing workflows',async()=>{
 if(site.template==='client')return;
 const matrix=[
  ['services','A website with'],
  ['approach','Clear process'],
  ['living','Made to work'],
  ['contact','Good things start with a conversation'],
  ['privacy','Built with care']
 ];
 for(const [route,heading] of matrix){
  const html=await readFile('dist/'+route+'/index.html','utf8');
  const d=new JSDOM(html).window.document;
  assert.equal(d.querySelectorAll('h1').length,1,'one main heading: '+route);
  assert.match(d.querySelector('h1').textContent, new RegExp(heading,'i'));
  if(route==='contact'){
   assert.ok(d.querySelector('.enquiry-desk'),'contact retains the enquiry desk');
   assert.ok(d.querySelector('.desk-paper form[action="/api/contact"]'),'the real enquiry route is inside the project desk');
   assert.ok(d.querySelector('.desk-art[src="/art/living-garden.webp"]'));
   assert.ok(d.querySelector('link[href="/contact-desk.css"]'));
   assert.equal(d.querySelectorAll('.interior-opening,link[href="/interior-opening.css"]').length,0,'contact must not restore the oversized decorative hero');
   continue;
  }
  assert.ok(d.querySelector('.interior-opening'),'cinematic opening: '+route);
  assert.ok(d.querySelector('.agency-interior'),'agency-only frame: '+route);
  assert.ok(d.querySelector('link[href="/agency-interiors.css"]'));
  assert.ok(d.querySelector('link[href="/interior-opening.css"]'));
  assert.ok(d.querySelector('#interior-content'));
 }
 const contact=new JSDOM(await readFile('dist/contact/index.html','utf8')).window.document;
 assert.ok(contact.querySelector('form[action="/api/contact"]'),'local demo submission form must remain intact');
 const plugins=new JSDOM(await readFile('dist/plugins/index.html','utf8')).window.document;
 assert.ok(plugins.querySelector('.plugin-hero'),'plugin route retained');
 assert.ok(plugins.querySelector('.cinematic-site-header'),'plugin route retains agency navigation');
 assert.equal(plugins.querySelectorAll('link[href="/agency-interiors.css"],link[href="/interior-opening.css"]').length,0,'Plugins must not load unrelated interior animation CSS');
});

test('Services has a distinctive editorial progression, not a repeated stock-card grid',async()=>{
 if(site.template==='client')return;
 const home=new JSDOM(await readFile('dist/index.html','utf8')).window.document;
 const services=new JSDOM(await readFile('dist/services/index.html','utf8')).window.document;
 assert.ok(home.querySelector('link[href^="/cinematic-home.css"]'),'homepage loads its own visual CSS');
 assert.equal(services.querySelectorAll('link[href^="/cinematic-home.css"]').length,0,'interior route must not load homepage art');
 assert.ok(services.querySelector('link[href="/services-editorial.css"]'));
 assert.equal(services.querySelectorAll('h1').length,1);
 for(const selector of ['.service-offer','.service-price-pane','.service-spec','.service-ledger','.service-questions','.faq']){
  assert.ok(services.querySelector(selector),'missing editorial section '+selector);
 }
 assert.equal(services.querySelectorAll('.service-offer .service-price strong').length,1);
 assert.match(services.querySelector('.service-price').textContent,/US\$\s*500/);
 assert.equal(services.querySelectorAll('.service-payment strong').length,2);
 assert.match(services.querySelector('.service-ledger-note').textContent,/separately scoped/i);
 assert.equal(services.querySelectorAll('section.service-spec .card').length,0,'no repeated stock cards');
 assert.ok(services.querySelector('a[href="/contact/?service=website"]'),'existing intake link');
 const css=await readFile('public/living-studio.css','utf8');
 assert.match(css,/background:#f5f1e8/);
 assert.match(css,/background:#233d2e/);
 assert.ok(services.querySelector('link[href^="/living-studio.css"]'));

});

test('Services photographic opening keeps the price legible and forest FAQ readable',async()=>{
 if(site.template==='client')return;
 const doc=new JSDOM(await readFile('dist/services/index.html','utf8')).window.document;
 const scene=doc.querySelector('.interior-opening--services .io-panel-front');
 assert.equal(scene.querySelector('strong')?.textContent,'US$500');
 assert.ok(doc.querySelector('.io-scene .io-photo[src="/art/living-garden.webp"]'));
 assert.equal(doc.querySelectorAll('.io-orbit,.io-halo,.io-panel-back').length,0);
 const css=await readFile('public/living-studio.css','utf8');
 assert.match(css,/white-space:nowrap;max-width:100%/);
 assert.match(css,/\.service-questions \.faq summary\{color:#eeeede\}/);
 assert.match(css,/\.service-questions \.faq details\[open\]\{background:#2d4835\}/);
 assert.match(css,/\.service-questions \.faq details p\{color:#d1d9c3\}/);
 const sheets=[...doc.querySelectorAll('link[rel=stylesheet]')].map(n=>n.getAttribute('href'));
 assert.ok(sheets.findIndex(s=>s.startsWith('/living-studio.css'))>sheets.indexOf('/services-editorial.css'));
 assert.ok(doc.querySelectorAll('.service-questions summary').length>2,'full FAQ preserved');
});

test('privacy preview links use the shared forest palette and focus treatment',async()=>{
 const page=await readFile('src/pages/[...page].astro','utf8');
 const styles=await readFile('public/living-studio.css','utf8');
 assert.match(page,/preview-privacy-content/);
 assert.match(page,/live EZERWRIGHT contact page/);
 assert.match(styles,/preview-privacy-content a\{color:#28573a/);
 assert.match(styles,/:focus-visible\{outline:2px solid #3c664a/);
});
