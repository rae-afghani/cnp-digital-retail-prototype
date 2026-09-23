(()=>{
  const mq=window.matchMedia('(max-width:760px)');
  const cards=[...document.querySelectorAll('.stack-categories .category-tile')];
  if(!cards.length)return;
  let ticking=false;
  const stackTop=76;

  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

  function reset(){
    cards.forEach(card=>{
      card.style.transform='';
      card.style.opacity='';
      card.style.filter='';
      card.style.setProperty('--stack-progress','0');
      card.classList.remove('stack-active','stack-behind');
    });
  }

  function update(){
    ticking=false;
    if(!mq.matches){reset();return;}

    const vh=window.innerHeight||700;
    const animationStart=vh*.72;
    const animationEnd=stackTop+95;

    cards.forEach((card,i)=>{
      const rect=card.getBoundingClientRect();
      const next=cards[i+1];
      const nextRect=next?next.getBoundingClientRect():null;

      let progress=0;
      if(nextRect){
        progress=clamp((animationStart-nextRect.top)/(animationStart-animationEnd),0,1);
      }

      const isPinned=rect.top<=stackTop+2;
      const scale=1-(progress*.075);
      const lift=progress*18;
      const opacity=1-(progress*.15);
      const brightness=1-(progress*.22);

      card.style.setProperty('--stack-progress',progress.toFixed(3));

      if(isPinned||progress>0){
        card.classList.add('stack-active');
        card.style.transform=`translateY(${-lift}px) scale(${scale})`;
        card.style.opacity=String(opacity);
        card.style.filter=`brightness(${brightness})`;
      }else{
        card.classList.remove('stack-active');
        card.style.transform='';
        card.style.opacity='1';
        card.style.filter='';
      }

      if(progress>.82) card.classList.add('stack-behind');
      else card.classList.remove('stack-behind');
    });
  }

  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  if(mq.addEventListener)mq.addEventListener('change',()=>requestAnimationFrame(update));
  else mq.addListener(()=>requestAnimationFrame(update));
  requestAnimationFrame(()=>requestAnimationFrame(update));
})();
