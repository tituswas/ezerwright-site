import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';
const read=p=>readFileSync(p,'utf8');

test('audit service has a dedicated route without leaking into client sites',()=>{
 const path='src/pages/audits/[...index].astro';
 assert.ok(existsSync(path),'dedicated audit route must exist');
 const source=read(path);
 assert.match(source,/getStaticPaths/);
 assert.match(source,/site\.template\s*===\s*'client'/);
 if(site.template==='client')return;
 assert.ok(existsSync('dist/audits/index.html'),'audit page must build');
 const doc=new JSDOM(read('dist/audits/index.html')).window.document;
 assert.equal(doc.querySelectorAll('h1').length,1);
 assert.match(doc.body.textContent,/coming soon/i);
 assert.match(doc.body.textContent,/written (permission|authorization)/i);
 assert.match(doc.body.textContent,/source.code/i);
 assert.match(doc.body.textContent,/not (a |an )?(certification|guarantee)/i);
 assert.doesNotMatch(doc.body.textContent,/\$\s*(600|650|699|700)|Cloudflare.certified|100% secure/i);
 assert.ok(doc.querySelector('a[href="/contact/?service=other"]'));
 assert.equal(doc.querySelectorAll('form').length,0,'reuse protected contact route; no new collector');
});

test('both agency navigation landmarks link to the audit business',()=>{
 if(site.template==='client')return;
 const doc=new JSDOM(read('dist/index.html')).window.document;
 assert.ok(doc.querySelector('header a[href="/audits/"]'));
 assert.ok(doc.querySelector('footer a[href="/audits/"]'));
 assert.ok(doc.querySelector('main a[href="/audits/"]'));
 assert.ok(doc.querySelector('#project-brief'),'existing interactive project brief retained');
 assert.equal(doc.querySelectorAll('.website-panel a[href^="/showcase/"]').length,3);
});

test('refresh stylesheet is agency-only and includes accessible motion and focus rules',()=>{
 assert.ok(existsSync('public/agency-refresh.css'),'refresh stylesheet must exist');
 const css=read('public/agency-refresh.css');
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/@media/);
 const doc=new JSDOM(read('dist/index.html')).window.document;
 assert.equal(Boolean(doc.querySelector('link[href^="/agency-refresh.css"]')),site.template!=='client');
});

test('audit page has canonical metadata and is included in agency sitemap',()=>{
 if(site.template==='client')return;
 assert.ok(existsSync('dist/audits/index.html'));
 const doc=new JSDOM(read('dist/audits/index.html')).window.document;
 assert.equal(doc.querySelector('link[rel="canonical"]').href,new URL('/audits/',site.origin).href);
 assert.match(doc.title,/AI.app.*(audit|security)/i);
 assert.match(read('dist/sitemap.xml'),/\/audits\//);
 const graphs=[...doc.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent));
 assert.ok(graphs.length);
 assert.doesNotMatch(JSON.stringify(graphs),/AggregateRating|reviewCount|priceCurrency/,'no fabricated proof or unapproved audit pricing');
});
