// overlay menu
const menu = document.getElementById('menu');
document.querySelector('.hamburger')?.addEventListener('click', ()=> menu?.classList.add('open'));
document.querySelector('.menu-close')?.addEventListener('click', ()=> menu?.classList.remove('open'));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

// scroll-reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
