import {EmailMessage} from 'cloudflare:email';
import {productionSettings as settings} from './production-settings.mjs';
import {createContactRouter} from './adapter.mjs';
const contact=createContactRouter(settings,{fetch:(...args)=>fetch(...args),send:async(from,to,raw,env)=>env.SEND_EMAIL.send(new EmailMessage(from,to,raw))});
export default {fetch:contact};
