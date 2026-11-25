(() => {
  const menu=document.querySelector('.menu-toggle');
  const navigation=document.querySelector('#main-navigation');
  if(menu&&navigation){
    document.querySelector('.site-header').classList.add('js-menu');menu.hidden=false;
    const close=()=>{menu.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');};
    menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){close();menu.focus();}});
    navigation.addEventListener('click',event=>{if(event.target.closest('a'))close();});
  }
  const form=document.querySelector('.contact-form');if(!form)return;
  const service=form.querySelector('[name=service]');const selected=new URLSearchParams(location.search).get('service');
  if(selected&&[...service.options].some(o=>o.value===selected))service.value=selected;
  const status=document.querySelector('#form-status');const errors=document.querySelector('#form-errors');const button=form.querySelector('button[type=submit]');const normalLabel=button.textContent;
  const security=form.querySelector('[data-security-check]');
  const enableSecurity=security?.querySelector('[data-enable-security]');
  let challenge=null;
  if(security&&enableSecurity){
    const securityStatus=security.querySelector('[data-security-status]');
    const container=security.querySelector('[data-turnstile-container]');
    enableSecurity.addEventListener('click',async()=>{
      if(enableSecurity.disabled||challenge!==null)return;
      enableSecurity.disabled=true;securityStatus.textContent='Loading the spam check…';
      let script;
      try{
        if(!window.turnstile){
          await new Promise((resolve,reject)=>{
            script=document.createElement('script');
            script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async=true;
            const timeout=setTimeout(()=>reject(Error('Security check timed out')),15000);
            script.onload=()=>{clearTimeout(timeout);resolve();};
            script.onerror=()=>{clearTimeout(timeout);reject(Error('Security check unavailable'));};
            document.head.append(script);
          });
        }
        await new Promise(resolve=>window.turnstile.ready(resolve));
        container.hidden=false;
        challenge=window.turnstile.render(container,{
          sitekey:security.dataset.sitekey,action:'contact',size:window.innerWidth<420?'compact':'normal',
          callback:()=>{securityStatus.textContent='Spam verification complete. You can send your enquiry.';},
          'expired-callback':()=>{securityStatus.textContent='Spam check expired. Please retry.';},
          'error-callback':()=>{securityStatus.textContent='Spam check failed. Retry or email us.';}
        });
        enableSecurity.hidden=true;securityStatus.textContent='Complete the check, then send.';
      }catch{
        script?.remove();container.hidden=true;enableSecurity.disabled=false;
        securityStatus.textContent='Spam check could not load. Retry or email us. Nothing was sent.';
      }
    });
  }
  function clearErrors(){errors.replaceChildren();errors.hidden=true;for(const control of form.querySelectorAll('[aria-invalid]')){control.removeAttribute('aria-invalid');control.removeAttribute('aria-describedby');}for(const field of form.querySelectorAll('.field-error')){field.textContent='';field.hidden=true;}}
  function showErrors(message,fields={}){
    errors.hidden=false;const heading=document.createElement('p');heading.textContent=message;errors.append(heading);
    const list=document.createElement('ul');for(const name of ['name','email','business','service','message'])if(fields[name]){const control=form.elements.namedItem(name);const field=document.getElementById('error-'+name);const item=document.createElement('li');item.textContent=String(fields[name]);item.dataset.errorField=name;list.append(item);control.setAttribute('aria-invalid','true');control.setAttribute('aria-describedby',field.id);field.textContent=String(fields[name]);field.hidden=false;}if(list.children.length)errors.append(list);errors.focus();
  }
  form.addEventListener('input',event=>{
    const control=event.target;if(!control.name||!control.hasAttribute('aria-invalid'))return;
    control.removeAttribute('aria-invalid');control.removeAttribute('aria-describedby');
    const field=document.getElementById('error-'+control.name);if(field){field.hidden=true;field.textContent='';}
    for(const item of errors.querySelectorAll('[data-error-field]'))if(item.dataset.errorField===control.name)item.remove();
    if(!errors.querySelector('[data-error-field]')){errors.hidden=true;errors.replaceChildren();}
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(form.dataset.sending)return;
    clearErrors();status.textContent='';
    const blank={};for(const [name,label]of [['name','Name'],['message','Project message']]){
      const field=form.elements.namedItem(name);
      if(field.required&&!field.value.trim())blank[name]=label+' is required.';
    }
    if(Object.keys(blank).length){showErrors('Please complete the required fields.',blank);form.elements.namedItem(Object.keys(blank)[0]).focus();return;}
    if(security&&(!form.elements.namedItem('cf-turnstile-response')?.value)){
      showErrors('Enable spam verification before sending. Nothing was sent.');
      if(!enableSecurity.hidden)enableSecurity.focus();
      return;
    }
    form.dataset.sending='true';button.disabled=true;button.textContent='Submitting…';
    try{
      const result=await fetch(form.action,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},credentials:'same-origin',body:new URLSearchParams(new FormData(form)),signal:AbortSignal.timeout(15000)});
      const data=await result.json();
      if(!result.ok||data.ok!==true){showErrors(data.message||'The enquiry was not submitted. Please try again.',data.errors);return;}
      status.textContent=data.message;form.reset();status.focus();
    }catch{showErrors('We could not confirm whether your enquiry was submitted. Your details are still here. Use the email address on this page before retrying to avoid a duplicate enquiry.');}
    finally{delete form.dataset.sending;button.disabled=false;button.textContent=normalLabel;if(window.turnstile){try{window.turnstile.reset();}catch{}}}
  });
})();
