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
  function clearErrors(){errors.replaceChildren();errors.hidden=true;for(const control of form.querySelectorAll('[aria-invalid]')){control.removeAttribute('aria-invalid');control.removeAttribute('aria-describedby');}for(const field of form.querySelectorAll('.field-error')){field.textContent='';field.hidden=true;}}
  function showErrors(message,fields={}){
    errors.hidden=false;const heading=document.createElement('p');heading.textContent=message;errors.append(heading);
    const list=document.createElement('ul');for(const name of ['name','email','business','service','message'])if(fields[name]){const control=form.elements.namedItem(name);const field=document.getElementById('error-'+name);const item=document.createElement('li');item.textContent=String(fields[name]);list.append(item);control.setAttribute('aria-invalid','true');control.setAttribute('aria-describedby',field.id);field.textContent=String(fields[name]);field.hidden=false;}if(list.children.length)errors.append(list);errors.focus();
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(form.dataset.sending)return;
    clearErrors();status.textContent='';form.dataset.sending='true';button.disabled=true;button.textContent='Submitting…';
    try{
      const result=await fetch(form.action,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},credentials:'same-origin',body:new URLSearchParams(new FormData(form)),signal:AbortSignal.timeout(15000)});
      const data=await result.json();
      if(!result.ok||data.ok!==true){showErrors(data.message||'The enquiry was not submitted. Please try again.',data.errors);return;}
      status.textContent=data.message;form.reset();status.focus();
    }catch{showErrors('The enquiry was not submitted. Check the connection, retry, or use the contact details on this site.');}
    finally{delete form.dataset.sending;button.disabled=false;button.textContent=normalLabel;if(window.turnstile){try{window.turnstile.reset();}catch{}}}
  });
})();
