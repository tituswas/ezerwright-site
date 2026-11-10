import {readFile,writeFile,mkdir,copyFile}from'node:fs/promises';
await mkdir('dist/__qa',{recursive:true});
const after=await readFile('dist/index.html','utf8');
const before=after.replace(/<a class="room-inline"[\s\S]*?<\/a>/,'').replace(/(class="room-launcher"[^>]*?) hidden/,'$1').replace(/\/project-room\.js\?v=[^" ]+/g,'/__qa/room-before.js').replace(/\/project-room\.css\?v=[^" ]+/g,'/__qa/room-before.css');
for(const [name,html]of Object.entries({after,before,nojs:after.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'')}))await writeFile('dist/__qa/home-'+name+'.json',JSON.stringify(html));
await copyFile('test/browser/cta-harness.html','dist/__qa/index.html');await copyFile('test/browser/cta-harness.js','dist/__qa/harness.js');
for(const name of ['room-before.js','room-before.css'])await copyFile('test/browser/'+name,'dist/__qa/'+name);
