import {cp,mkdir,readdir,readFile,writeFile,access} from 'node:fs/promises';
import {resolve,relative,sep,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
export async function packageHandoff(destination){
  const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const target=resolve(destination);
  if(target===root||(target.startsWith(root+sep)&&!target.startsWith(resolve(root,'handoff')+sep)))throw new Error('Cannot package over the source project');
  try{await access(target);throw new Error('Handoff destination exists; refusing to overwrite it.');}catch(error){if(error.code!=='ENOENT')throw error;}
  await access(resolve(root,'dist/index.html'));await mkdir(target,{recursive:true});
  const excluded=new Set(['node_modules','.git','.astro','.runtime','.wrangler','dist','handoff','evidence']);
  const filter=file=>{const parts=relative(root,file).split(sep);return !parts.some(p=>excluded.has(p)||p.startsWith('.env')&&p!=='.env.example')&&!file.endsWith('generated-config.json');};
  await mkdir(resolve(target,'source'));
  for(const entry of await readdir(root)){const file=resolve(root,entry);if(filter(file))await cp(file,resolve(target,'source',entry),{recursive:true,filter});}
  await cp(resolve(root,'dist'),resolve(target,'site'),{recursive:true});
  const files={};async function walk(dir){for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const file=resolve(dir,entry.name);if(entry.isDirectory())await walk(file);else{const bytes=await readFile(file);files[relative(target,file).split(sep).join('/')]= {bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}}}await walk(target);
  await writeFile(resolve(target,'MANIFEST.json'),JSON.stringify({version:'0.1.0',files},null,2)+'\n');return target;
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){const check=spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});if(check.status!==0)process.exit(check.status||1);const tests=spawnSync(process.execPath,['--test','test/*.test.mjs'],{stdio:'inherit'});if(tests.status!==0)process.exit(tests.status||1);console.log(await packageHandoff(process.argv[2]||'handoff/v0.1.0'));}
