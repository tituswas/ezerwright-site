import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';

test('agency cinematic homepage offers transparent commercial terms and real routes',async()=>{
 if(site.template==='client')return;
 const html=await readFile('dist/index.html','utf8');
 const doc=new JSDOM(html).window.document;
 assert.match(doc.querySelector('h1')?.textContent||'',/website that feels ahead/i);
 assert.match(doc.body.textContent,/US\$500/);
 assert.match(doc.body.textContent,/\$250 to start/);
 assert.equal(doc.querySelectorAll('a[href^="/showcase/"]').length,3);
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

test('all agency interior routes sustain the cinematic visual system without changing existing workflows',async()=>{
 if(site.template==='client')return;
 const matrix=[
  ['services','A website with'],
  ['approach','Clear process'],
  ['living','Made to work'],
  ['contact','You have the idea'],
  ['privacy','Built with care']
 ];
 for(const [route,heading] of matrix){
  const html=await readFile('dist/'+route+'/index.html','utf8');
  const d=new JSDOM(html).window.document;
  assert.equal(d.querySelectorAll('h1').length,1,'one main heading: '+route);
  assert.match(d.querySelector('h1').textContent, new RegExp(heading,'i'));
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
 assert.ok(plugins.querySelector('.cinematic-site-header'),'plugin route retains dark brand navigation');
});

test('Services has a distinctive editorial progression, not a repeated stock-card grid',async()=>{
 if(site.template==='client')return;
 const home=new JSDOM(await readFile('dist/index.html','utf8')).window.document;
 const services=new JSDOM(await readFile('dist/services/index.html','utf8')).window.document;
 assert.ok(home.querySelector('link[href="/cinematic-home.css"]'),'homepage loads its own visual CSS');
 assert.equal(services.querySelectorAll('link[href="/cinematic-home.css"]').length,0,'interior route must not load homepage art');
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
 const css=await readFile('public/services-editorial.css','utf8');
 assert.match(css,/background:#e7eef1/);
 assert.match(css,/background:#1b2937/);
 assert.doesNotMatch(css,/#f4f5ee/);
});

test('Services moving price label stays contained and dark FAQ remains legible',async()=>{
 if(site.template==='client')return;
 const html=await readFile('dist/services/index.html','utf8');
 const doc=new JSDOM(html).window.document;
 const scene=doc.querySelector('.interior-opening--services .io-panel-front');
 assert.ok(scene,'Services animated panel exists');
 assert.equal(scene.querySelector('strong')?.textContent,'US$500');
 const css=await readFile('public/interior-opening.css','utf8');
 assert.match(css,/\.interior-opening--services \.io-panel-front\{[^}]*overflow:hidden/);
 assert.match(css,/\.interior-opening--services \.io-panel-front strong\{[^}]*max-width:100%/);
 assert.match(css,/\.interior-opening--services \.io-panel-front strong\{[^}]*white-space:nowrap/);
 assert.match(css,/io-service-front 6s/,'retain approved front panel animation');
 assert.match(css,/io-service-back 7s/,'retain approved back panel animation');
 const editorial=await readFile('public/services-editorial.css','utf8');
 assert.match(editorial,/\.agency-interior \.service-questions \.faq summary\{color:#f3fafb\}/);
 assert.match(editorial,/\.agency-interior \.service-questions \.faq details\[open\]\{background:#263b4c\}/);
 assert.match(editorial,/\.agency-interior \.service-questions \.faq details p\{color:#d4e5eb\}/);
 const sheets=[...doc.querySelectorAll('link[rel=stylesheet]')].map(n=>n.getAttribute('href'));
 assert.ok(sheets.indexOf('/services-editorial.css')>sheets.indexOf('/agency-interiors.css'),'page-specific contrast CSS must override shared interior CSS');
 assert.ok(doc.querySelectorAll('.service-questions summary').length>2,'full FAQ preserved');
});
