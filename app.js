// ═══════════════════════════════════════════════════
// HOUSTON CARPET CLEANING (HCC) — APP.JS
// Compact booking + logo animation edition
// front-animation skill applied throughout
// ═══════════════════════════════════════════════════

const SERVICES = [
  { id:'deep',        name:'Deep Extraction',   desc:'Truck-mounted hot-water extraction.', price:159, unit:'per room',  icon:'◈' },
  { id:'steam',       name:'Steam Sanitize',    desc:'Chemical-free 99.9% bacteria kill.',  price:139, unit:'per room',  icon:'◉' },
  { id:'stain',       name:'Stain Treatment',   desc:'Enzyme removal of stains & spots.',   price:99,  unit:'per area',  icon:'◍' },
  { id:'pet',         name:'Pet Odor',          desc:'Sub-surface enzyme odor treatment.',  price:129, unit:'per room',  icon:'◎' },
  { id:'upholstery',  name:'Upholstery',        desc:'Sofas, sectionals, accent chairs.',   price:109, unit:'per piece', icon:'▣' },
  { id:'tile',        name:'Tile & Grout',      desc:'High-pressure clean + sealant.',      price:179, unit:'per area',  icon:'⬡' }
];

const ADDONS = [
  { id:'protector',    name:'Carpet Protector',        price:49 },
  { id:'deodorize',    name:'Whole-Room Deodorizer',   price:35 },
  { id:'speed-dry',    name:'Speed Dry',               price:29 },
  { id:'antimicrobial',name:'Antimicrobial Treatment', price:59 },
  { id:'baseboard',    name:'Baseboard Cleaning',      price:39 },
  { id:'furniture',    name:'Furniture Moving',        price:45 }
];

const TIMES  = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const selSvc   = new Set();
const selAddon = new Set();
let selDate = null, selTime = null;
let calM = new Date().getMonth(), calY = new Date().getFullYear();


// ═══════════════════════════════════════════════════
// CANVAS STEAM PARTICLES — hero background
// ═══════════════════════════════════════════════════
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = 1 + Math.random() * 2.5;
      this.vy = -(0.25 + Math.random() * 0.55);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.life = 0;
      this.maxLife = 180 + Math.random() * 220;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.life++;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.life * 0.025 + this.phase) * 0.15;
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      const t = this.life / this.maxLife;
      const alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192,122,58,${alpha * 0.2})`;
      ctx.fill();
    }
  }

  let last = 0, rafId;
  function loop(ts) {
    const dt = Math.min((ts - last) / 16.67, 3);
    last = ts;
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(loop);
  }

  resize();
  particles = Array.from({ length: Math.min(60, Math.floor(W / 24)) }, () => new Particle());
  rafId = requestAnimationFrame(loop);
  new ResizeObserver(() => { resize(); particles = Array.from({ length: Math.min(60, Math.floor(W / 24)) }, () => new Particle()); }).observe(canvas.parentElement);
})();


// ═══════════════════════════════════════════════════
// HERO ENTRANCE
// ═══════════════════════════════════════════════════
function runHeroEntrance() {
  setTimeout(() => document.querySelector('.hero-grid')?.classList.add('hero-running'), 80);
}


// ═══════════════════════════════════════════════════
// ANIMATED NUMBER COUNTERS
// ═══════════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target, target = parseInt(el.dataset.target, 10), dur = 1400, start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));
}


// ═══════════════════════════════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════════════════════════════
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.15s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}


// ═══════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════
function revealAll() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv:not(.vis)').forEach(el => obs.observe(el));
}


// ═══════════════════════════════════════════════════
// RIPPLE ON CALENDAR
// ═══════════════════════════════════════════════════
function addRipple(btn, e) {
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const rip = document.createElement('span');
  rip.className = 'ripple';
  rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 500);
}


// ═══════════════════════════════════════════════════
// STEP BAR
// ═══════════════════════════════════════════════════
function updateStepBar() {
  const steps = document.querySelectorAll('.step');
  if (!steps.length) return;
  const hasSvc   = selSvc.size > 0;
  const hasSched = selDate && selTime;
  steps[0].className = 'step ' + (hasSvc ? 'done' : 'active');
  steps[1].className = 'step ' + (hasSvc && !hasSched ? 'active' : hasSvc ? 'done' : '');
  steps[2].className = 'step ' + (hasSched ? 'done' : hasSvc ? 'active' : '');
}


// ═══════════════════════════════════════════════════
// RENDERING — compact layout
// ═══════════════════════════════════════════════════

function drawServices() {
  const el = document.getElementById('svcGrid');
  el.innerHTML = SERVICES.map((s, i) => {
    const on = selSvc.has(s.id);
    return `
      <div class="svc-mini ${on ? 'on' : ''}" onclick="togSvc('${s.id}')"
           style="animation: fade-up-hero 0.4s var(--ease-out-expo) ${i * 50}ms both">
        <div class="mini-check">✓</div>
        <div class="mini-ico">${s.icon}</div>
        <div class="mini-name">${s.name}</div>
        <div class="mini-price">$${s.price}</div>
      </div>`;
  }).join('');
  updateStepBar();
}

function drawAddons() {
  const el = document.getElementById('addonGrid');
  el.innerHTML = ADDONS.map((a, i) => {
    const on = selAddon.has(a.id);
    return `
      <div class="ao-pill ${on ? 'on' : ''}" onclick="togAddon('${a.id}')"
           style="animation: fade-up-hero 0.35s var(--ease-out-expo) ${i * 35}ms both">
        <span class="ao-pill-check">${on ? '✓' : ''}</span>
        ${a.name}
        <span class="ao-pill-price">+$${a.price}</span>
      </div>`;
  }).join('');
}

function drawCal() {
  document.getElementById('calTitle').textContent = `${MONTHS[calM]} ${calY}`;
  document.getElementById('calWk').innerHTML = WKDAYS.map(d => `<span>${d}</span>`).join('');

  const grid = document.getElementById('calDays');
  const first = new Date(calY, calM, 1).getDay();
  const days  = new Date(calY, calM + 1, 0).getDate();
  const todayFlat = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  let h = '';
  for (let i = 0; i < first; i++) h += '<button class="day nil" tabindex="-1"></button>';
  for (let d = 1; d <= days; d++) {
    const dt   = new Date(calY, calM, d);
    const past = dt < todayFlat, sun = dt.getDay() === 0;
    const isNow = dt.getTime() === todayFlat.getTime();
    const isSel = selDate && d === selDate.getDate() && calM === selDate.getMonth() && calY === selDate.getFullYear();
    let c = 'day' + (past||sun ? ' off' : '') + (isNow ? ' now' : '') + (isSel ? ' sel' : '');
    if (past || sun) h += `<button class="${c}" disabled>${d}</button>`;
    else             h += `<button class="${c}" onclick="pickDay(${d}, event)">${d}</button>`;
  }
  grid.innerHTML = h;
}

function drawTimes() {
  document.getElementById('timeGrid').innerHTML = TIMES.map((t, i) =>
    `<button class="t-btn-compact ${selTime === t ? 'sel' : ''}"
      style="animation: fade-up-hero 0.28s var(--ease-out-expo) ${i * 22}ms both"
      onclick="pickTime('${t}')">${t}</button>`
  ).join('');
  updateStepBar();
}

function drawSummary() {
  const el   = document.getElementById('sideBody');
  const svcs = SERVICES.filter(s => selSvc.has(s.id));
  const adds = ADDONS.filter(a => selAddon.has(a.id));

  if (!svcs.length) { el.innerHTML = '<p class="side-empty">Select a service to get started</p>'; return; }

  const total = svcs.reduce((a,s) => a + s.price, 0) + adds.reduce((a,x) => a + x.price, 0);
  const ready = selDate && selTime;

  let h = '<div class="sg-label">Services</div>';
  svcs.forEach((s,i) => {
    h += `<div class="s-row" style="animation:slide-in-row 0.3s var(--ease-out-expo) ${i*40}ms both">
      <span class="s-lbl">${s.name}</span><span class="s-val">$${s.price}</span></div>`;
  });
  if (adds.length) {
    h += '<div class="sg-label">Add-ons</div>';
    adds.forEach((a,i) => {
      h += `<div class="s-row" style="animation:slide-in-row 0.3s var(--ease-out-expo) ${i*35}ms both">
        <span class="s-lbl">${a.name}</span><span class="s-val">+$${a.price}</span></div>`;
    });
  }
  if (selDate) {
    const ds = selDate.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
    h += '<div class="sg-label">Appointment</div>';
    h += `<div class="s-row"><span class="s-lbl">Date</span><span class="s-val">${ds}</span></div>`;
  }
  if (selTime) h += `<div class="s-row"><span class="s-lbl">Time</span><span class="s-val">${selTime}</span></div>`;

  h += `<div class="s-line"></div>
    <div class="s-total">
      <span class="s-lbl">Estimated Total</span>
      <span class="s-val total-bounce">$${total}</span>
    </div>
    <button class="btn btn-fill s-book-btn" onclick="submitBooking()" ${ready ? '' : 'disabled'}>
      Confirm Booking
    </button>`;

  el.innerHTML = h;
  // micro-bounce on total
  const tv = el.querySelector('.total-bounce');
  if (tv) { tv.style.animation = 'none'; requestAnimationFrame(() => tv.style.animation = 'check-pop 0.35s var(--ease-spring) both'); }
}


// ═══════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════

function togSvc(id) {
  selSvc.has(id) ? selSvc.delete(id) : selSvc.add(id);
  drawServices(); drawSummary();
}
function togAddon(id) {
  selAddon.has(id) ? selAddon.delete(id) : selAddon.add(id);
  drawAddons(); drawSummary();
}
function pickDay(d, e) {
  selDate = new Date(calY, calM, d);
  if (e) addRipple(e.currentTarget, e);
  drawCal(); drawSummary(); updateStepBar();
}
function pickTime(t) { selTime = t; drawTimes(); drawSummary(); }
function calPrev() { calM--; if (calM < 0) { calM = 11; calY--; } drawCal(); }
function calNext() { calM++; if (calM > 11) { calM = 0; calY++; } drawCal(); }


// ═══════════════════════════════════════════════════
// SUBMIT
// ═══════════════════════════════════════════════════

function submitBooking() {
  if (!selSvc.size)  return toast('Please select at least one service.', 'err');
  if (!selDate)      return toast('Please choose a date.', 'err');
  if (!selTime)      return toast('Please choose a time.', 'err');

  const first = document.getElementById('inFirst').value.trim();
  const last  = document.getElementById('inLast').value.trim();
  const phone = document.getElementById('inPhone').value.trim();
  const email = document.getElementById('inEmail').value.trim();
  const addr  = document.getElementById('inAddr').value.trim();
  const notes = document.getElementById('inNotes').value.trim();

  if (!first || !last)                return toast('Please enter your full name.', 'err');
  if (!phone)                         return toast('Please enter your phone number.', 'err');
  if (!email || !email.includes('@')) return toast('Please enter a valid email.', 'err');
  if (!addr)                          return toast('Please enter your service address.', 'err');

  const svcs  = SERVICES.filter(s => selSvc.has(s.id));
  const adds  = ADDONS.filter(a => selAddon.has(a.id));
  const total = svcs.reduce((a,s) => a+s.price,0) + adds.reduce((a,x) => a+x.price,0);
  const dateStr = selDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});

  const booking = { id:Date.now(), customer:{firstName:first,lastName:last,phone,email,address:addr},
    services:svcs.map(s=>s.name), addons:adds.map(a=>a.name), date:dateStr, time:selTime, total, notes, createdAt:new Date().toISOString() };

  try { const ex = JSON.parse(localStorage.getItem('hcc_bookings')||'[]'); ex.push(booking); localStorage.setItem('hcc_bookings',JSON.stringify(ex)); } catch(e){}
  console.log('📋 HCC Booking:', booking);

  try {
    emailjs.init('nXQUsDLhh1813vy2u');
    emailjs.send('service_wzwcvbp','template_cd5md6n',{
      customer_name:`${first} ${last}`, phone, email, address:addr,
      services:svcs.map(s=>s.name).join(', '), addons:adds.length?adds.map(a=>a.name).join(', '):'None',
      date:dateStr, time:selTime, total, notes:notes||'None'
    }).catch(err=>console.warn('⚠️ Email failed:',err));
  } catch(e){}

  document.getElementById('modalMsg').textContent =
    `Thank you, ${first}! Your HCC cleaning has been scheduled. We'll send confirmation to ${email} within the hour.`;

  let receipt = `<div class="mr-row"><span class="mr-l">Services</span><span class="mr-v">${svcs.map(s=>s.name).join(', ')}</span></div>`;
  if (adds.length) receipt += `<div class="mr-row"><span class="mr-l">Add-ons</span><span class="mr-v">${adds.map(a=>a.name).join(', ')}</span></div>`;
  receipt += `<div class="mr-row"><span class="mr-l">Date</span><span class="mr-v">${dateStr}</span></div>`;
  receipt += `<div class="mr-row"><span class="mr-l">Time</span><span class="mr-v">${selTime}</span></div>`;
  receipt += `<div class="mr-row"><span class="mr-l">Address</span><span class="mr-v">${addr}</span></div>`;
  receipt += `<div class="mr-row mr-total"><span class="mr-l">Total</span><span class="mr-v">$${total}</span></div>`;

  document.getElementById('modalReceipt').innerHTML = receipt;
  document.getElementById('overlay').classList.add('open');

  selSvc.clear(); selAddon.clear(); selDate=null; selTime=null;
  ['inFirst','inLast','inPhone','inEmail','inAddr','inNotes'].forEach(id => document.getElementById(id).value='');
  drawServices(); drawAddons(); drawCal(); drawTimes(); drawSummary();
}

function dismissModal() { document.getElementById('overlay').classList.remove('open'); }


// ═══════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════

function toast(msg, type='ok') {
  const el = document.getElementById('toastBar');
  el.textContent = msg; el.className = `toast-bar ${type}`;
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => el.classList.remove('show'), 3400);
}

function onScroll() { document.getElementById('siteHeader').classList.toggle('pinned', window.scrollY > 50); }
function toggleBurger() { document.getElementById('mainNav').classList.toggle('open'); }


// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════

function init() {
  drawServices(); drawAddons(); drawCal(); drawTimes(); drawSummary();
  runHeroEntrance(); initMagnetic(); revealAll();

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  document.getElementById('burger').addEventListener('click', toggleBurger);
  document.querySelectorAll('.main-nav a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('mainNav').classList.remove('open'))
  );
  document.getElementById('overlay').addEventListener('click', e => { if (e.target===e.currentTarget) dismissModal(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') dismissModal(); });

  console.log('✦ HCC App — Compact Booking + Animated Logo');
}

init();
