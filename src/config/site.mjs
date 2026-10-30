import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateConfig} from './validate.mjs';

// Cloudflare's branch identity distinguishes a public production build from
// a non-indexed, form-disabled design preview. Never infer it from an arbitrary
// SITE_CONFIG name or a user-supplied URL query.
const pages=process.env.CF_PAGES==='1';
const branch=process.env.CF_PAGES_BRANCH||'';
const isPagesPreview=pages&&branch!==''&&branch!=='main';

// Preview builds show the same agency copy as production, but cannot expose
// production submission routes or inherit a configured release credential.
const filename=isPagesPreview?'src/config/production.json':process.env.SITE_CONFIG||'src/config/site.json';
const config=JSON.parse(readFileSync(resolve(filename),'utf8'));
if(isPagesPreview){
  const previewUrl=new URL(process.env.CF_PAGES_URL||'');
  if(previewUrl.protocol!=='https:'||
    !/^[a-z0-9-]+\.ezerwright-site\.pages\.dev$/.test(previewUrl.hostname)||
    previewUrl.username||previewUrl.password||previewUrl.port||
    previewUrl.pathname!=='/'||previewUrl.search||previewUrl.hash){
    throw new Error('Cloudflare preview requires a valid ezerwright-site.pages.dev deployment URL');
  }
  config.origin=previewUrl.origin;
  config.mode='demo';
  config.productionApproved=false;
  config.turnstileSiteKey='';
  config.preview=true;
}
if(config.mode==='production'){
  if(process.env.TURNSTILE_SITE_KEY)config.turnstileSiteKey=process.env.TURNSTILE_SITE_KEY;
  if(process.env.PRIVACY_APPROVED==='true')config.privacyApproved=true;
}
export const site=validateConfig(config);
