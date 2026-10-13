import {defineConfig} from 'astro/config';
import {site} from './src/config/site.mjs';
export default defineConfig({site:site.origin,output:'static',trailingSlash:'always',build:{format:'directory'},devToolbar:{enabled:false}});
