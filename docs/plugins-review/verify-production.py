"""Local-only browser verification. Requires Python Playwright and system Chromium.
Usage: python verify-production-preview.py DIST_DIRECTORY EVIDENCE_DIRECTORY
External requests and all non-GET/HEAD requests are blocked. No forms submitted.
"""
import functools, http.server, json, re, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(root)))
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
base=f'http://127.0.0.1:{server.server_port}'
results=[];blocked=[];failures=[];non_get=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  def allow_local(route):
   request=route.request
   if request.method not in ['GET','HEAD']:
    non_get.append(request.url);route.abort()
   elif request.url.startswith(base+'/'):
    route.continue_()
   else:
    blocked.append(request.url);route.abort()
  context=browser.new_context(device_scale_factor=1)
  context.route('**/*',allow_local)
  routes=['','services','approach','living','contact','privacy','plugins','plugins/services']
  for slug in routes:
   for width in [320,390,768,1024,1440]:
    page=context.new_page()
    page.set_viewport_size({'width':width,'height':960})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    response=page.goto(base+'/'+(slug+'/' if slug else ''))
    page.wait_for_selector('.site-header.js-menu',state='attached');page.evaluate('document.fonts.ready')
    banner=page.locator('.demo-banner').count()
    text=page.locator('body').inner_text()
    notices=bool(re.search(r'private demonstration|sample information only|not a live business enquiry page|synthetic details only|no email is sent',text,re.I))
    footer=page.locator('.footer-note').inner_text()
    nav=page.locator('nav[aria-label="Main navigation"]')
    menu=page.get_by_role('button',name=re.compile('Menu'))
    desktop=width>680
    menu_ok=menu.is_visible()!=desktop and nav.is_visible()==desktop
    header_link=nav.locator('a[href="/plugins/"]')
    footer_link=page.locator('nav[aria-label="Footer navigation"] a[href="/plugins/"]')
    links_ok=header_link.count()==1 and footer_link.count()==1 and footer_link.is_visible()
    overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth')
    home=page.get_by_role('link',name='EZERWRIGHT home')
    logo=home.locator('.identity-symbol img')
    logo_ok=logo.count()==1 and logo.evaluate("e=>e.complete && e.naturalWidth>0 && e.getAttribute('src')==='/favicon.svg' && e.alt==='' && e.getBoundingClientRect().width>=29")
    menu_spacing=desktop or menu.evaluate("e=>getComputedStyle(e).gap==='8px' && getComputedStyle(e).alignItems==='center' && e.getBoundingClientRect().height>=44")
    # Capture a fresh, untouched document before keyboard tests or axe injection.
    if slug in ['plugins','plugins/services'] and width in [390,1440]:
     page.screenshot(path=str(out/(slug.replace('/','-')+('-mobile' if width==390 else '-desktop')+'.png')),full_page=True)
    page.keyboard.press('Tab');skip=page.evaluate("document.activeElement.textContent==='Skip to content'")
    page.keyboard.press('Enter');main=page.evaluate("document.activeElement.id==='main'")
    home.focus()
    logo_focus=home.evaluate("e=>e===document.activeElement && getComputedStyle(e).outlineStyle==='solid' && parseFloat(getComputedStyle(e).outlineWidth)>=3")
    keyboard=skip and main and logo_focus
    if not desktop:
     menu.click();keyboard=keyboard and menu.get_attribute('aria-expanded')=='true' and header_link.is_visible()
     page.keyboard.press('Escape');keyboard=keyboard and menu.get_attribute('aria-expanded')=='false' and not nav.is_visible() and menu.evaluate('e=>e===document.activeElement')
    page.emulate_media(reduced_motion='reduce')
    motion=page.locator('a').first.evaluate("e=>getComputedStyle(e).transitionDuration==='0s' && getComputedStyle(e).animationName==='none'")
    page.add_script_tag(path=str(Path(__file__).resolve().parents[2]/'node_modules/axe-core/axe.min.js'))
    axe=page.evaluate("""async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}});return r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))}""")
    result=dict(route='/'+(slug+'/' if slug else ''),width=width,status=response.status,bannerCount=banner,demoNotices=notices,productionFooter='© EZERWRIGHT' in footer,headerFooterPlugins=links_ok,menuNavigation=menu_ok,logoAsset=logo_ok,logoKeyboardFocus=logo_focus,menuSpacing=menu_spacing,overflow=overflow,keyboard=keyboard,reducedMotion=motion,axe=axe,pageErrors=errors)
    results.append(result)
    if response.status!=200 or banner or notices or '© EZERWRIGHT' not in footer or not links_ok or not menu_ok or not logo_ok or not menu_spacing or overflow or not keyboard or not motion or axe or errors:failures.append(result)
    page.close()
  # Additional reflow and no-JavaScript navigation checks for every agency page.
  supplemental=[]
  nojs=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':960});nojs.route('**/*',allow_local)
  for slug in routes:
   page=nojs.new_page();page.goto(base+'/'+(slug+'/' if slug else ''))
   ok=page.locator('#main-navigation').is_visible() and not page.locator('.menu-toggle').is_visible() and not page.evaluate('document.documentElement.scrollWidth>innerWidth')
   supplemental.append(dict(route=slug or '/',noJS=ok));page.close()
   page=context.new_page();page.set_viewport_size({'width':320,'height':960});page.goto(base+'/'+(slug+'/' if slug else ''))
   page.evaluate("document.documentElement.style.fontSize='200%'")
   ok=not page.evaluate('document.documentElement.scrollWidth>innerWidth')
   supplemental[-1]['textScale200Percent']=ok;page.close()
  boundaries=[]
  for width in [680,681]:
   page=context.new_page();page.set_viewport_size({'width':width,'height':960});page.goto(base+'/plugins/')
   page.wait_for_selector('.site-header.js-menu',state='attached')
   menu=page.locator('.menu-toggle');nav=page.locator('#main-navigation')
   ok=menu.is_visible()==(width==680) and nav.is_visible()==(width==681)
   if width==680:
    menu.focus();page.keyboard.press('Enter')
    link=page.get_by_role('navigation',name='Main navigation').get_by_role('link',name='Plugins')
    ok=ok and link.is_visible();link.click();page.wait_for_url(base+'/plugins/')
    ok=ok and menu.get_attribute('aria-expanded')=='false'
   boundaries.append(dict(width=width,menuBreakpointAndPluginsLink=ok));page.close()
  font_independence=[]
  fontless=browser.new_context();fontless.route('**/*',allow_local);fontless.route('**/*.woff',lambda r:r.abort())
  for width in [390,1440]:
   page=fontless.new_page();page.set_viewport_size({'width':width,'height':960});page.goto(base+'/plugins/')
   logo=page.locator('.identity-symbol img');ok=logo.evaluate('e=>e.complete && e.naturalWidth>0')
   font_independence.append(dict(width=width,logoWithoutWebFonts=ok));page.close()
  browser.close()
 evidence=dict(mode='production',settings='Existing production configuration; synthetic public Turnstile key; isolated static build',browser='Chromium',widths=[320,390,768,1024,1440],checks=results,supplemental=supplemental,breakpointChecks=boundaries,fontIndependence=font_independence,externalRequestsBlocked=sorted(set(blocked)),nonGETRequests=non_get,failedChecks=len(failures))
 (out/'browser-checks.json').write_text(json.dumps(evidence,indent=2)+'\n')
 print(json.dumps(dict(pageWidthChecks=len(results),failures=failures,supplemental=supplemental,breakpointChecks=boundaries,fontIndependence=font_independence,externalRequestsBlocked=sorted(set(blocked)),nonGETRequests=non_get),indent=2))
 assert not failures and not non_get and all(x['noJS'] and x['textScale200Percent'] for x in supplemental) and all(x['menuBreakpointAndPluginsLink'] for x in boundaries) and all(x['logoWithoutWebFonts'] for x in font_independence)
finally:
 server.shutdown();server.server_close();thread.join()
