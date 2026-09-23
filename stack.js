(()=>{
  const mq=window.matchMedia('(max-width:760px)');
  const cards=[...document.querySelectorAll('.stack-categories .category-tile')];
  if(!cards.length)return;

  const stackTop=68;
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const state=cards.map(()=>({current:0,target:0}));
  let raf=0;

  function reset(){
    state.forEach(s=>{s.current=0;s.target=0});
    cards.forEach(card=>{
      card.style.transform='';
      card.style.opacity='';
      card.style.filter='';
      card.classList.remove('stack-active','stack-behind');
    });
  }

  function setTargets(){
    if(!mq.matches){reset();return;}
    const viewport=window.innerHeight||700;
    const overlapStart=viewport*.90;
    const overlapEnd=stackTop+155;
    const lastIndex=cards.length-1;

    cards.forEach((card,i)=>{
      const rect=card.getBoundingClientRect();
      const next=cards[i+1];
      const nextRect=next?next.getBoundingClientRect():null;
      let progress=0;

      if(nextRect){
        /* Cards 1–6 react to the next card approaching. */
        progress=clamp((overlapStart-nextRect.top)/(overlapStart-overlapEnd),0,1);
      }else if(i===lastIndex){
        /* Keep the final card full-size while it overlaps card 6.
           Only let it settle after it is almost pinned, so its motion
           is visibly staggered from card 6 rather than matching it. */
        const finalStart=stackTop+150;
        const finalEnd=stackTop+25;
        progress=clamp((finalStart-rect.top)/(finalStart-finalEnd),0,1);
        progress=progress*progress*(3-2*progress);
      }

      state[i].target=progress;
    });
    if(!raf)raf=requestAnimationFrame(animate);
  }

  function animate(){
    raf=0;
    let keepGoing=false;
    const lastIndex=cards.length-1;

    cards.forEach((card,i)=>{
      const s=state[i];
      const easing=i===lastIndex?.11:.16;
      s.current += (s.target-s.current)*easing;
      if(Math.abs(s.target-s.current)>.002) keepGoing=true;
      else s.current=s.target;

      const p=s.current;
      const isLast=i===lastIndex;
      const scale=1-(p*(isLast?.045:.085));
      const lift=p*(isLast?14:28);
      const opacity=1-(p*(isLast?.07:.14));
      const brightness=1-(p*(isLast?.10:.20));

      if(p>.003){
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

      if(p>(isLast?.72:.56)) card.classList.add('stack-behind');
      else card.classList.remove('stack-behind');
    });

    if(keepGoing)raf=requestAnimationFrame(animate);
  }

  window.addEventListener('scroll',setTargets,{passive:true});
  window.addEventListener('resize',setTargets,{passive:true});
  if(mq.addEventListener)mq.addEventListener('change',setTargets);
  else mq.addListener(setTargets);
  requestAnimationFrame(()=>requestAnimationFrame(setTargets));
})();
