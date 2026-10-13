const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MAX_BODY=32768;
export function response(request,status,data){
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"};
  if(status===405)headers.Allow='POST';
  if(status===429)headers['Retry-After']='60';
  if(request.headers.get('Accept')?.includes('application/json'))return Response.json(data,{status,headers});
  headers['Content-Type']='text/html; charset=utf-8';
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${data.ok?'Enquiry recorded':'Enquiry not submitted'}</title><body><main><h1>${data.ok?'Enquiry recorded':'Enquiry not submitted'}</h1><p>${escapeHTML(data.message)}</p>${data.errors?'<ul>'+Object.values(data.errors).map(e=>`<li>${escapeHTML(e)}</li>`).join('')+'</ul>':''}<p><a href="/contact/">Return to contact</a></p>${data.ok?'':'<p>Use your browser’s Back button to restore the form values, or contact the owner through the website’s contact details.</p>'}</main></body></html>`,{status,headers});
}
async function boundedBody(request){
  if(Number(request.headers.get('Content-Length'))>MAX_BODY)throw new RangeError('Body too large');
  const reader=request.body?.getReader(); if(!reader)return '';
  let size=0;const chunks=[];
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){await reader.cancel();throw new RangeError('Body too large');}chunks.push(value);}}finally{reader.releaseLock();}
  const all=new Uint8Array(size);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}return new TextDecoder('utf-8',{fatal:true}).decode(all);
}
export async function handleContact(request,settings,adapters){
  const error=(status,message,errors)=>response(request,status,{ok:false,message,...(errors?{errors}:{})});
  if(request.method!=='POST')return error(405,'Use the contact form to submit an enquiry.');
  if(request.headers.get('Origin')!==settings.origin)return error(403,'This enquiry must be submitted from this website.');
  if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/x-www-form-urlencoded'))return error(415,'Use the website contact form.');
  let raw;try{raw=await boundedBody(request);}catch(e){return error(e instanceof RangeError?413:400,e instanceof RangeError?'The enquiry is too large.':'The enquiry could not be read.');}
  if(settings.mode==='production'&&(!adapters.verify||!adapters.allow))return error(503,'The contact service is not ready. Please use the contact details on this site.');
  const form=new URLSearchParams(raw);const allowed=['name','email','business','service','message','website','cf-turnstile-response'];
  for(const key of form.keys())if(!allowed.includes(key)||form.getAll(key).length!==1)return error(400,'Unexpected or duplicate form fields.');
  if(form.get('website'))return error(400,'The enquiry could not be accepted.');
  const data=Object.fromEntries(['name','email','business','service','message'].map(k=>[k,(form.get(k)||'').trim()]));const errors={};
  for(const [key,max]of Object.entries({name:100,email:254,business:150,message:2000}))if(data[key].length>max)errors[key]=`Keep ${key} within ${max} characters.`;
  for(const key of ['name','email','message'])if(!data[key])errors[key]=`${key==='name'?'Name':key==='email'?'Email':'Project message'} is required.`;
  for(const key of ['name','email','business','service'])if(/[\r\n\x00-\x1f\x7f]/.test(data[key]))errors[key]='Please remove control characters.';
  if(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(data.message))errors.message='Please remove control characters.';
  if(data.email&&!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(data.email))errors.email='Enter a valid email address.';
  if(!settings.services.includes(data.service))errors.service='Choose a listed service.';
  if(Object.keys(errors).length)return error(400,'Please check the highlighted fields.',errors);
  try{
    if(adapters.allow && !await adapters.allow(request))return error(429,'Too many attempts. Please wait a minute before trying again.');
    if(settings.mode==='production'&&!await adapters.verify(form.get('cf-turnstile-response')||'',request))return error(400,'Verification expired or failed. Please try again.');
    await adapters.deliver(data);
  }catch{return error(503,'The enquiry was not submitted. Please retry or use the contact details on this site.');}
  return response(request,200,{ok:true,delivery:settings.mode==='demo'?'local-capture':'provider-accepted',message:settings.mode==='demo'?'Your test enquiry was captured locally. No email was sent.':'Your enquiry was submitted. The delivery provider accepted it; final inbox delivery is not confirmed here.'});
}
