import {cp,mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {validateConfig} from '../src/config/validate.mjs';
export async function adaptClient(config,destination){
  validateConfig(config);const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const target=resolve(destination);
  if(target===root||target.startsWith(root+sep))throw new Error('Choose a separate client directory outside the starter.');
  try{await access(target);throw new Error('Destination already exists; refusing to overwrite it.');}catch(error){if(error.code!=='ENOENT')throw error;}
  await mkdir(target);
  const excluded=new Set(['node_modules','.git','.astro','.runtime','.wrangler','dist','handoff','evidence']);
  await cp(root,target,{recursive:true,filter:source=>{const parts=relative(root,source).split(sep);return !parts.some(p=>excluded.has(p)||p.startsWith('.env')&&p!=='.env.example')&&!source.endsWith('generated-config.json');}});
  await writeFile(resolve(target,'src/config/site.json'),JSON.stringify(config,null,2)+'\n');
  return target;
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){const [, ,configFile,destination]=process.argv;if(!configFile||!destination)throw new Error('Usage: node scripts/adapt.mjs CLIENT_CONFIG.json NEW_DIRECTORY');const target=await adaptClient(JSON.parse(await readFile(configFile,'utf8')),destination);console.log(`Client copy created: ${target}. Run npm ci, npm run qa and npm run demo there.`);}
