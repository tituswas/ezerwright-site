const agencyCopy={
 '':['Small Business Websites & Web Design | EZERWRIGHT','Web design for service businesses: mobile-ready pages, a working enquiry form and source files you own. Clear scope and no mandatory hosting contract.'],
 services:['Five-Page Business Website Offer | EZERWRIGHT','Ask about our introductory five-page website offer. Eligibility, enquiry functionality, revisions and delivery are confirmed in a written scope.'],
 approach:['Website Design Process & Client Handover | EZERWRIGHT','Understand the EZERWRIGHT website process: written scope, private staging, agreed revisions, explicit acceptance and client-owned source files.'],
 living:['Website Updates & Improvements | EZERWRIGHT','Keep your business website useful with separately scoped content updates, website improvements and future integrations. No compulsory maintenance contract.'],
 contact:['Contact EZERWRIGHT | Discuss Your Business Website','Tell EZERWRIGHT about your website, improvement or update project. Start by email and agree a clear scope before work begins.'],
 privacy:['Privacy & Website Enquiry Information | EZERWRIGHT','Read how EZERWRIGHT uses contact enquiries, which providers process them, and how to ask about your information.'],
 plugins:['Plugins & MCP Integration Services | EZERWRIGHT','Explore EZERWRIGHT’s plugin catalog in preparation and discuss separately scoped plugin setup, MCP connections and integration support.'],
 'plugins/services':['Plugin Setup & MCP Integration Support | EZERWRIGHT','Discuss plugin installation, custom connectors, integration audits and support with EZERWRIGHT. Scope, permissions and pricing are agreed separately.']
};
export const isSearchPage=slug=>slug!=='404'&&!slug.startsWith('showcase/');
export function pageSeo(site,page){
 const agency=site.name==='EZERWRIGHT'&&site.template!=='client';
 const copy=agency&&Object.hasOwn(agencyCopy,page.slug)?agencyCopy[page.slug]:[page.title,page.description];
 const title=copy[0].includes(site.name)?copy[0]:`${copy[0]} | ${site.name}`;
 const description=copy[1],canonical=new URL(page.slug?`/${page.slug}/`:'/',site.origin).href;
 const robots=site.mode==='demo'?'noindex, nofollow':isSearchPage(page.slug)?'index, follow':'noindex, follow';
 const orgId=new URL('/#organization',site.origin).href,webId=new URL('/#website',site.origin).href;
 const graph=[{'@type':'Organization','@id':orgId,name:site.name,url:site.origin,logo:new URL('/favicon.svg',site.origin).href,...(site.mode==='production'?{email:site.email}:{})},{'@type':'WebSite','@id':webId,name:site.name,url:site.origin,publisher:{'@id':orgId},inLanguage:'en'},{'@type':page.slug==='contact'?'ContactPage':page.slug==='about'?'AboutPage':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,isPartOf:{'@id':webId},inLanguage:'en'}];
 if(agency&&page.slug==='services')graph.push({'@type':'Service','@id':canonical+'#website-design',name:'Five-page business website design',serviceType:'Business website design',url:canonical,provider:{'@id':orgId},description:'Up to five marketing pages, a scoped enquiry form, agreed revisions and portable source files.'});
 return {title,description,canonical,robots,schema:{'@context':'https://schema.org','@graph':graph}};
}
