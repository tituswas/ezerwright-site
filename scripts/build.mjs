import {spawnSync} from 'node:child_process';
import {mkdir,writeFile,rm,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {site} from '../src/config/site.mjs';
import {pluginRoutes} from '../src/config/plugins.mjs';
if(process.env.CF_PAGES==='1'){
  const branch=process.env.CF_PAGES_BRANCH||'';
  if(branch!=='main'&&branch!==''&&site.preview===true&&site.mode==='demo'){
    // Preview: non-indexed, no contact form, no email provider, no Turnstile.
  }else if(branch==='main'&&site.mode==='production'&&site.preview!==true){
    // Production: validateConfig already requires approved privacy and Turnstile.
  }else{
    throw Error('Cloudflare Pages requires the production configuration for main or an explicitly identified safe preview branch. Set SITE_CONFIG=src/config/production.json, a real TURNSTILE_SITE_KEY and approved privacy settings for production.');
  }
}
await rm('dist',{recursive:true,force:true});
const child=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
if(child.status!==0)process.exit(child.status||1);
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...site.pages,...pluginRoutes(site).map(slug=>({slug})),...(site.template==='client'?[]:['showcase/exterior','showcase/pool','showcase/landscape'].map(slug=>({slug})))].map(p=>`<url><loc>${escape(new URL(p.slug?`/${p.slug}/`:'/',site.origin).href)}</loc></url>`).join('')+'</urlset>\n');
await writeFile('dist/robots.txt',site.mode==='demo'?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
await mkdir('worker',{recursive:true});
await writeFile('worker/generated-config.json',JSON.stringify({origin:site.origin,mode:site.mode,services:[...site.services.map(s=>s.id),'other']},null,2)+'\n');
await writeFile('dist/og-card.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${site.theme.ink}"/><rect x="80" y="90" width="70" height="7" fill="white"/><text x="80" y="270" font-family="sans-serif" font-size="54" fill="white">${escape(site.name)}</text><text x="80" y="350" font-family="sans-serif" font-size="30" fill="white">${site.mode==='demo'?'Private demonstration':'A useful next step.'}</text></svg>`);
const hashes=new Set();
async function inlineHashes(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await inlineHashes(path);else if(path.endsWith('.html'))for(const match of (await readFile(path,'utf8')).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(match[1])hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);}}
await inlineHashes('dist');
const csp=`default-src 'self'; script-src 'self' https://challenges.cloudflare.com ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`;
await writeFile('dist/_headers',`/*\n  Content-Security-Policy: ${csp}\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/ui.js\n  Cache-Control: no-cache\n`);
// Host redirects belong in Cloudflare account rules; Pages _redirects only accepts source paths.
