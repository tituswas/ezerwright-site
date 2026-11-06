// Bounded, local-only showcase. Wheel handling is scoped to the website panel.
(()=>{'use strict';
const deck=document.querySelector('[data-showcase]');if(!deck)return;
const gallery=deck.closest('.selected-work'),panels=[...deck.querySelectorAll('[data-work-panel]')],prev=gallery.querySelector('[data-work-prev]'),next=gallery.querySelector('[data-work-next]'),position=gallery.querySelector('[data-work-position]'),status=gallery.querySelector('[data-work-status]'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let selected=0,lastEvent=-Infinity,wheelTotal=0,wheelDirection=0,wheelLatched=false,touch=null;
const select=(index,animate=true,move=true)=>{if(index<0||index>=panels.length||index===selected)return false;const old=panels[selected],forward=index>selected;selected=index;panels.forEach((p,i)=>p.classList.toggle('is-selected',i===index));const target=panels[index];if(move&&typeof deck.scrollTo==='function')deck.scrollTo({left:Math.max(0,target.offsetLeft),behavior:reduced.matches||document.documentElement.dataset.motion==='paused'?'instant':'smooth'});deck.dataset.direction=forward?'next':'previous';deck.classList.remove('is-turning');if(animate&&!reduced.matches&&document.documentElement.dataset.motion!=='paused'){void deck.offsetWidth;deck.classList.add('is-turning');}prev.disabled=index===0;next.disabled=index===panels.length-1;position.textContent=`0${index+1} / 0${panels.length}`;status.textContent=`${panels[index].getAttribute('aria-label')}. Concept selected.`;return old!==panels[index];};
panels[0].classList.add('is-selected');prev.disabled=true;gallery.classList.add('gallery-ready');
prev.addEventListener('click',()=>select(selected-1));next.addEventListener('click',()=>select(selected+1));
deck.addEventListener('animationend',()=>deck.classList.remove('is-turning'));
deck.addEventListener('wheel',event=>{if((deck.clientWidth&&deck.scrollWidth<=deck.clientWidth)||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;const dir=Math.sign(event.deltaY),now=performance.now();if(dir!==wheelDirection||now-lastEvent>180){wheelTotal=0;wheelLatched=false;}lastEvent=now;wheelDirection=dir;if((dir<0&&selected===0)||(dir>0&&selected===panels.length-1)){wheelTotal=0;return;}event.preventDefault();if(wheelLatched)return;wheelTotal+=Math.abs(event.deltaY)*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);if(wheelTotal>=36){select(selected+dir);wheelLatched=true;wheelTotal=0;}},{passive:false});
deck.addEventListener('pointerleave',()=>{wheelTotal=0;wheelDirection=0;wheelLatched=false;});
deck.addEventListener('keydown',event=>{if(event.target!==deck)return;const targets={ArrowRight:selected+1,ArrowDown:selected+1,ArrowLeft:selected-1,ArrowUp:selected-1,Home:0,End:panels.length-1};if(!(event.key in targets))return;if(select(targets[event.key]))event.preventDefault();});
// Swipe only on horizontal intent; vertical touch remains native page scrolling.
deck.addEventListener('touchstart',event=>{if(event.touches.length!==1){touch=null;return;}touch={x:event.touches[0].clientX,y:event.touches[0].clientY,native:deck.clientWidth&&deck.scrollWidth>deck.clientWidth};},{passive:true});
deck.addEventListener('touchend',event=>{if(!touch||!event.changedTouches.length)return;if(touch.native){touch=null;return;}const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)select(selected+(dx<0?1:-1));},{passive:true});
deck.addEventListener('touchcancel',()=>touch=null,{passive:true});
// Native touch, scrollbar and trackpad movement share the selected state.
let scrollTimer;deck.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const left=deck.scrollLeft;let nearest=0;panels.forEach((panel,i)=>{if(Math.abs(panel.offsetLeft-left)<Math.abs(panels[nearest].offsetLeft-left))nearest=i;});select(nearest,false,false);},120);},{passive:true});
panels.forEach((panel,i)=>panel.addEventListener('focusin',()=>select(i,false,false)));
reduced.addEventListener('change',()=>deck.classList.remove('is-turning'));
})();
