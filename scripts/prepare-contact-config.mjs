import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {productionSettings} from '../worker/production-settings.mjs';
export async function contactDeploymentConfig(recipient){
  if(typeof recipient!=='string'||recipient.length>254||!/^[^\s<>\r\n@]+@[^\s<>\r\n@]+\.[^\s<>\r\n@]+$/.test(recipient)||/\.(invalid|test)$/.test(recipient))throw Error('A real, verified destination email is required.');
  const config=JSON.parse(await readFile(new URL('../wrangler.contact.jsonc',import.meta.url),'utf8'));
  config.main=fileURLToPath(new URL('../worker/contact.mjs',import.meta.url));
  config.send_email=[{name:'SEND_EMAIL',destination_address:recipient}];
  config.vars.CONTACT_TO=recipient;
  return config;
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){
  const config=await contactDeploymentConfig(process.env.CONTACT_TO);
  if(productionSettings.mode!=='production'||productionSettings.origin!=='https://ezerwright.com')throw Error('Contact deployment needs the production origin and mode.');
  await mkdir('.wrangler',{recursive:true,mode:0o700});
  await writeFile('.wrangler/contact-deploy.json',JSON.stringify(config,null,2)+'\n',{mode:0o600});
  console.log('Prepared restricted contact deployment configuration. Nothing has been deployed.');
}
