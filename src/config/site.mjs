import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateConfig} from './validate.mjs';
const config=JSON.parse(readFileSync(resolve(process.env.SITE_CONFIG||'src/config/site.json'),'utf8'));
if(config.mode==='production'){
  if(process.env.TURNSTILE_SITE_KEY)config.turnstileSiteKey=process.env.TURNSTILE_SITE_KEY;
  if(process.env.PRIVACY_APPROVED==='true')config.privacyApproved=true;
}
export const site=validateConfig(config);
