import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateConfig} from './validate.mjs';
export const site=validateConfig(JSON.parse(readFileSync(resolve(process.env.SITE_CONFIG||'src/config/site.json'),'utf8')));
