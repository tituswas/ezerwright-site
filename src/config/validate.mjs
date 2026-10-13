export function contrast(a,b){const luminance=hex=>{const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};const values=[luminance(a),luminance(b)].sort((a,b)=>a-b);return (values[1]+.05)/(values[0]+.05);}
export function validateConfig(config) {
  const required=['name','origin','mode','email','theme','services','pages'];
  for (const key of required) if (!config?.[key]) throw new Error(`Missing configuration: ${key}`);
  if (!['demo','production'].includes(config.mode)) throw new Error('Invalid site mode');
  if (typeof config.name!=='string'||config.name.length>80||/[\r\n<>]/.test(config.name)) throw new Error('Invalid display name');
  const origin=new URL(config.origin);
  if(origin.protocol!=='https:'||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password) throw new Error('Use an HTTPS origin without path or credentials');
  if(!/^[^\s<>\r\n@]+@[^\s<>\r\n@]+\.[^\s<>\r\n@]+$/.test(config.email)) throw new Error('Invalid contact email');
  if(config.phone && !/^\+?[\d ()-]{7,24}$/.test(config.phone)) throw new Error('Invalid phone');
  if(config.mode==='production'&&(!config.productionApproved||/\.(test|invalid|localhost)$/.test(origin.hostname)||/example\./.test(origin.hostname)||/\.(test|invalid)$/.test(config.email))) throw new Error('Production needs owner approval, real origin and verified contact');
  if(Object.keys(config.theme).some(key=>!['ink','accent','surface','text'].includes(key)))throw new Error('Unknown theme entry');
  for(const key of ['ink','accent','surface','text']) if(!/^#[a-f\d]{6}$/i.test(config.theme[key]||'')) throw new Error(`Invalid theme ${key}`);
  for(const [a,b] of [[config.theme.ink,'#FFFFFF'],[config.theme.accent,'#FFFFFF'],[config.theme.text,'#FFFFFF'],[config.theme.accent,config.theme.surface],[config.theme.text,config.theme.surface],[config.theme.ink,config.theme.surface],['#475569',config.theme.surface],['#CAD7E7',config.theme.ink]])if(contrast(a,b)<4.5)throw new Error('Theme colors must preserve 4.5:1 text contrast');
  if(config.mode==='production'&&(!config.privacyApproved||!Array.isArray(config.privacySections)||config.privacySections.length<3||!/^0x[a-zA-Z0-9_-]{8,}$/.test(config.turnstileSiteKey||'')))throw new Error('Production needs approved privacy content and a Turnstile site key');
  if(config.template && !['agency','client'].includes(config.template))throw new Error('Invalid template');
  if(!Array.isArray(config.services)||config.services.length<1||config.services.length>8) throw new Error('Use one to eight services');
  for(const s of config.services) if(!/^[a-z][a-z0-9-]{1,30}$/.test(s.id)||typeof s.title!=='string'||typeof s.summary!=='string')throw new Error('Invalid service');
  if(new Set(config.services.map(s=>s.id)).size!==config.services.length)throw new Error('Duplicate service IDs');
  if(!Array.isArray(config.pages)||![5,6].includes(config.pages.length))throw new Error('Expected four or five marketing pages plus privacy');
  const slugs=config.pages.map(p=>p.slug);
  const basic=['','services','approach','contact','privacy'];
  if(slugs.length===5&&slugs.join(',')!==basic.join(','))throw new Error('Invalid base route order');
  if(slugs.length===6){
    const extra=slugs[3];
    if(slugs.slice(0,3).join(',')!==basic.slice(0,3).join(',')||slugs.slice(4).join(',')!=='contact,privacy'||!/^[a-z][a-z0-9-]{1,35}$/.test(extra)||basic.includes(extra))throw new Error('Invalid fifth marketing route');
  }
  if(new Set(slugs).size!==slugs.length)throw new Error('Duplicate route slug');
  for(const p of config.pages)if(typeof p.title!=='string'||!p.title||typeof p.description!=='string'||p.description.length<20||(p.navLabel!==undefined&&(typeof p.navLabel!=='string'||p.navLabel.length>30||/[<>\r\n]/.test(p.navLabel))))throw new Error('Invalid page metadata');
  if(config.template==='client')for(const p of config.pages.filter(p=>!['contact','privacy'].includes(p.slug)))if(!Array.isArray(p.sections)||!p.sections.length)throw new Error('Client pages need configured sections');
  return {...config,origin:origin.origin};
}
