// Public project preferences only: no personal data, storage, tracking or automatic submission.
(()=>{'use strict';
 const projects={
  website:{title:'A defined five-page website.',price:'US$500',scope:'Up to five marketing pages, a scoped enquiry form, two revision rounds and portable source files.',terms:'US$250 after approved scope · US$250 after accepted staging.',message:'I’m interested in the defined five-page website package.'},
  improvements:{title:'A focused website improvement.',price:'Separately quoted',scope:'Start with what is getting in the way. We agree the changes, boundaries and price before work begins.',terms:'A separate scope. No automatic additions to the US$500 website package.',message:'I’d like to improve my existing website.'},
  updates:{title:'A website that stays current.',price:'Separately quoted',scope:'Refresh the services, offers or business details that need attention, with a defined update scope.',terms:'Updates and maintenance are separately scoped and priced.',message:'I’d like to update my existing website.'}
 };
 const goals={clarity:'A clearer offer',enquiries:'An easier path to enquiries',mobile:'A stronger mobile experience'};
 const panel=document.querySelector('.project-brief');
 if(panel){let selected='website';const goal=panel.querySelector('#brief-goal');const buttons=[...panel.querySelectorAll('[data-brief]')];
  const render=()=>{const p=projects[selected];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.brief===selected)));for(const field of ['title','price','scope','terms'])panel.querySelector('[data-brief-'+field+']').textContent=p[field];panel.querySelector('[data-brief-link]').href='/contact/?'+new URLSearchParams({service:selected,brief:selected,goal:goal.value});};
  buttons.forEach(b=>b.addEventListener('click',()=>{if(Object.hasOwn(projects,b.dataset.brief)){selected=b.dataset.brief;render();}}));goal.addEventListener('change',render);render();
 }
 const form=document.querySelector('.contact-form');if(!form)return;
 const q=new URLSearchParams(location.search),key=q.get('brief'),goal=q.get('goal');
 if(!Object.hasOwn(projects,key))return;
 const message=form.querySelector('[name=message]');if(!message||message.value.trim())return;
 const directions={bold:'Bold & expressive',calm:'Calm & considered',editorial:'Natural & editorial'},direction=q.get('direction');
 const p=projects[key];message.value=p.message+'\n\nMain priority: '+(Object.hasOwn(goals,goal)?goals[goal]:'To discuss by email')+'.'+(Object.hasOwn(directions,direction)?'\nVisual direction: '+directions[direction]+'.':'')+'\n\nBusiness website (if any):\nWhat should work better:\n';
 const note=document.createElement('p');note.className='brief-handoff';note.textContent='Your starter brief is ready below. Edit it in your own words, then add your name and email. Nothing has been sent.';form.before(note);
})();
