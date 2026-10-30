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
 const source=await readFile('src/components/CinematicExperience.astro','utf8');
 const demo=await readFile('src/pages/showcase/[slug].astro','utf8');
 assert.match(source,/prefers-reduced-motion:reduce/);
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
