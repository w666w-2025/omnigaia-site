// Mobile menu toggle
const burger = document.querySelector('.hamburger');
if (burger) burger.addEventListener('click', ()=>document.body.classList.toggle('open'));

// Close menu on link click (mobile)
document.querySelectorAll('.links a').forEach(a=>{
  a.addEventListener('click', ()=>document.body.classList.remove('open'));
});

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if (id.length>1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
