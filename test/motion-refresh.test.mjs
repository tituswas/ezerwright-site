import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {site} from '../src/config/site.mjs';

test('motion is optional and a real button pauses animation',()=>{
 if(site.template==='client')return;
 const doc=new JSDOM(readFileSync('dist/index.html','utf8')).window.document;
 assert.ok(doc.querySelector('button[data-motion-toggle][aria-pressed]'),'accessible motion control');
 assert.ok(doc.querySelector('[data-reveal]'),'progressive enhancement reveal targets');
 assert.ok(doc.querySelector('[data-showcase]'),'interactive native website composition');
 assert.ok(doc.querySelector('script[src="/agency-motion.js"]'));
 assert.equal(doc.querySelectorAll('[data-reveal][hidden]').length,0,'content must work before JavaScript');
});

test('motion script respects reduced motion and never replaces native scrolling or cursor',()=>{
 assert.ok(existsSync('public/agency-motion.js'),'motion script exists');
 const code=readFileSync('public/agency-motion.js','utf8');
 assert.match(code,/prefers-reduced-motion/);
 assert.match(code,/IntersectionObserver/);
 assert.match(code,/requestAnimationFrame/);
 assert.match(code,/visibilitychange/);
 assert.match(code,/pointerleave/);
 assert.doesNotMatch(code,/preventDefault\(|localStorage|setInterval\(|document\.onmousemove|cursor\s*[:=]\s*['"]?none/);
});

test('motion toggle changes state in the actual browser script without touching forms',()=>{
 assert.ok(existsSync('public/agency-motion.js'));
 const dom=new JSDOM('<body class="agency-experience"><button data-motion-toggle aria-pressed="false">Pause motion</button><div data-reveal>Visible content</div><form><input value="preserve me"></form></body>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://ezerwright.test/'});
 const w=dom.window;
 w.matchMedia=query=>({matches:false,media:query,addEventListener(){},removeEventListener(){}});
 w.IntersectionObserver=class{observe(){} disconnect(){}};
 w.eval(readFileSync('public/agency-motion.js','utf8'));
 const button=w.document.querySelector('[data-motion-toggle]');
 button.click();
 assert.equal(button.getAttribute('aria-pressed'),'true');
 assert.equal(w.document.documentElement.dataset.motion,'paused');
 assert.equal(w.document.querySelector('input').value,'preserve me');
 button.click();
 assert.equal(button.getAttribute('aria-pressed'),'false');
 dom.window.close();
});
