import {EmailMessage} from 'cloudflare:email';
import settings from './generated-config.json';
import {createWorkerHandler} from './adapter.mjs';
const contact=createWorkerHandler(settings,{fetch:(...args)=>fetch(...args),send:async(from,to,raw,env)=>env.SEND_EMAIL.send(new EmailMessage(from,to,raw))});
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/contact')return contact(request,env);if(url.pathname.startsWith('/api/'))return new Response('Not found',{status:404});return env.ASSETS.fetch(request);}};
