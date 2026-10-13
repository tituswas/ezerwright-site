import {handleContact} from '../lib/contact.mjs';
const validEmail=value=>typeof value==='string'&&value.length<=254&&/^[^\s<>\r\n@]+@[^\s<>\r\n@]+\.[^\s<>\r\n@]+$/.test(value);
export function createWorkerHandler(settings,provider){
  return async(request,env)=>{
    if(settings.mode!=='production'||!validEmail(env.CONTACT_FROM)||!validEmail(env.CONTACT_TO)||!env.TURNSTILE_SECRET||!env.RATE_LIMIT_SALT||!env.SEND_EMAIL||!env.CONTACT_RATE_LIMIT?.limit)return new Response(JSON.stringify({ok:false,message:'The contact service is not configured. Please use the website contact details.'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
    return handleContact(request,settings,{
      allow:async req=>{const ip=req.headers.get('CF-Connecting-IP');if(!ip)return false;const input=new TextEncoder().encode(env.RATE_LIMIT_SALT+'\0'+ip);const digest=await crypto.subtle.digest('SHA-256',input);const key=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');return (await env.CONTACT_RATE_LIMIT.limit({key})).success===true;},
      verify:async(token,req)=>{if(!token||token.length>2048)return false;const r=await provider.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token,remoteip:req.headers.get('CF-Connecting-IP')||''}),signal:AbortSignal.timeout(5000)});if(!r.ok)return false;const data=await r.json();return data.success===true&&data.hostname===new URL(settings.origin).hostname&&data.action==='contact';},
      deliver:async data=>{
        const body=`Name: ${data.name}\nEmail: ${data.email}\nBusiness: ${data.business}\nService: ${data.service}\n\n${data.message}`;
        const raw=`From: ${env.CONTACT_FROM}\r\nTo: ${env.CONTACT_TO}\r\nReply-To: ${data.email}\r\nSubject: Website enquiry\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${Buffer.from(body,'utf8').toString('base64')}\r\n`;
        await provider.send(env.CONTACT_FROM,env.CONTACT_TO,raw,env);
      }
    });
  };
}
