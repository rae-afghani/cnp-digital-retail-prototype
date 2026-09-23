(()=>{
  const mq=window.matchMedia('(max-width:760px)');
  const cards=[...document.querySelectorAll('.stack-categories .category-tile')];
  if(!cards.length)return;
  let ticking=false, naturalTops=[];
  const stackTop=88;

  function measure(){
    cards.forEach(c=>{c.style.transform='';c.classList.remove('stack-behind')});
    naturalTops=cards.map(c=>c.getBoundingClientRect().top+window.scrollY);
    update();
  }

  function update(){
    ticking=false;
    if(!mq.matches){
      cards.forEach(c=>{c.style.transform='';c.style.opacity='';c.classList.remove('stack-behind')});
      return;
    }
    const trigger=window.scrollY+stackTop+4;
    let active=-1;
    naturalTops.forEach((top,i)=>{if(trigger>=top)active=i});
    cards.forEach((card,i)=>{
      const depth=Math.max(0,active-i);
      if(depth>0){
        const scale=Math.max(.92,1-depth*.018);
        const lift=Math.min(26,depth*7);
        card.style.transform=`translateY(${-lift}px) scale(${scale})`;
        card.style.opacity=String(Math.max(.78,1-depth*.055));
        card.classList.add('stack-behind');
      }else{
        card.style.transform='';
        card.style.opacity='1';
        card.classList.remove('stack-behind');
      }
    });
  }

  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',()=>requestAnimationFrame(measure),{passive:true});
  if(mq.addEventListener)mq.addEventListener('change',measure);
  else mq.addListener(measure);
  requestAnimationFrame(()=>requestAnimationFrame(measure));
})();
