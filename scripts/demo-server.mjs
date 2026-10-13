import {createServer} from 'node:http';
import {readFile,appendFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {site} from '../src/config/site.mjs';
import {handleContact} from '../lib/contact.mjs';
export function createDemoServer({directory='dist',inbox='.runtime/inbox.jsonl'}={}){
  const root=resolve(directory);const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
  const server=createServer(async(req,res)=>{
    try{
      const origin=`http://127.0.0.1:${server.address().port}`;
      const url=new URL(req.url,origin);
      if(url.pathname==='/api/contact'){
        const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:req,duplex:'half'}:{})});
        const result=await handleContact(request,{origin,mode:'demo',services:[...site.services.map(s=>s.id),'other']},{deliver:async data=>{await mkdir(resolve(inbox,'..'),{recursive:true,mode:0o700});await appendFile(inbox,JSON.stringify({...data,delivery:'local-capture'})+'\n',{mode:0o600});}});
        res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());return;
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Method not allowed');return;}
      const decoded=decodeURIComponent(url.pathname);let file=resolve(root,'.'+decoded+(decoded.endsWith('/')?'index.html':''));
      if(!file.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
      let body;let status=200;try{body=await readFile(file);}catch{status=404;file=resolve(root,'404.html');body=await readFile(file);}
      res.writeHead(status,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(400);res.end('Request could not be processed');}
  });return server;
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){const server=createDemoServer();server.listen(Number(process.env.PORT||4321),'127.0.0.1',()=>console.log(`Private local demonstration: http://127.0.0.1:${server.address().port}/\nSynthetic enquiries only; no external email. Capture file: .runtime/inbox.jsonl`));}
