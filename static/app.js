document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const intro=document.querySelector('[data-intro]');
const introPercent=document.querySelector('[data-intro-percent]');
const introBar=document.querySelector('.intro-bar i');
let progress=0;
const loading=setInterval(()=>{
  progress=Math.min(100,progress+Math.random()*18+7);
  if(introPercent)introPercent.textContent=Math.round(progress)+'%';
  if(introBar)introBar.style.width=progress+'%';
  if(progress>=100){
    clearInterval(loading);
    setTimeout(()=>{intro&&intro.classList.add('done');document.body.classList.add('ready')},320);
  }
},115);

const topbar=document.querySelector('.topbar');
const progressBar=document.querySelector('[data-progress]');
const scroll=()=>{
  const y=scrollY;
  topbar&&topbar.classList.toggle('scrolled',y>18);
  if(progressBar){
    const max=document.documentElement.scrollHeight-innerHeight;
    progressBar.style.width=(max>0?y/max*100:0)+'%';
  }
};
addEventListener('scroll',scroll,{passive:true});
scroll();

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('visible'),i*55);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08,rootMargin:'0px 0px -7% 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const cursor=document.querySelector('[data-cursor]');
const ring=document.querySelector('[data-cursor-ring]');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;

if(fine){
  addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(cursor)cursor.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
  },{passive:true});
  const ringLoop=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;if(ring)ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(ringLoop)};
  ringLoop();
  document.querySelectorAll('a,button,[data-tilt]').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring&&ring.classList.add('active'));
    el.addEventListener('mouseleave',()=>ring&&ring.classList.remove('active'));
  });
  document.querySelectorAll('.button,.pill').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.transform=`translate3d(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.16}px,0)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(950px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateZ(14px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

const parallax=document.querySelector('[data-parallax]');
if(parallax&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  let target=0,current=0;
  addEventListener('scroll',()=>{target=Math.min(scrollY*.16,95)},{passive:true});
  const move=()=>{current+=(target-current)*.08;parallax.style.transform=`translate3d(0,${current}px,0)`;requestAnimationFrame(move)};
  move();
}
