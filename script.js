const $ = s => document.querySelector(s), root = document.documentElement;

// Theme (remembers choice)
const themeBtn = $('#themeBtn');
function setTheme(t){ root.dataset.theme = t; themeBtn.textContent = t === 'dark' ? '☀️' : '🌙'; try{ localStorage.setItem('theme', t); }catch(e){} }
let saved = null; try{ saved = localStorage.getItem('theme'); }catch(e){}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

// Mobile menu
const nav = $('#nav'), menuBtn = $('#menuBtn');
menuBtn.onclick = () => menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open'));
nav.onclick = e => { if (e.target.tagName === 'A') nav.classList.remove('open'); };

// Live coordinates over Pakistan
const hero = $('#home'), coords = $('#coords');
hero.addEventListener('mousemove', e => {
  const r = hero.getBoundingClientRect();
  const lon = 60.9 + ((e.clientX - r.left) / r.width) * 16.9;
  const lat = 37.1 - ((e.clientY - r.top) / r.height) * 13.4;
  coords.textContent = `Lat ${lat.toFixed(4)} | Lon ${lon.toFixed(4)}`;
});

// Typing effect
const words = ['spatial data', 'remote sensing', 'Python', 'web GIS', 'clean web design'];
let w = 0, c = 0, del = false;
(function type(){
  const word = words[w], el = $('#typed');
  el.textContent = word.slice(0, c);
  if (!del && c++ === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && --c < 0) { del = false; c = 0; w = (w + 1) % words.length; }
  setTimeout(type, del ? 45 : 90);
})();

// Reveal sections + skill bars
const io = new IntersectionObserver(items => items.forEach(i => {
  if (i.isIntersecting) { i.target.classList.add(i.target.classList.contains('bar') ? 'on' : 'in'); io.unobserve(i.target); }
}), {threshold:.15});
document.querySelectorAll('.reveal,.bar').forEach(el => {
  if (el.dataset.level) el.querySelector('i').style.setProperty('--w', el.dataset.level + '%');
  io.observe(el);
});

// Scroll progress + back to top
addEventListener('scroll', () => {
  const h = root.scrollHeight - innerHeight;
  $('#progress').style.width = (scrollY / h * 100) + '%';
  $('#toTop').classList.toggle('show', scrollY > 500);
});
$('#toTop').onclick = () => scrollTo({top:0});

// Leaflet map (change names and coordinates)
if (window.L) {
  const map = L.map('leaflet').setView([33.68, 73.08], 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'© OpenStreetMap contributors'}).addTo(map);
  [
    [33.6500, 73.1560, 'COMSATS University', 'Where I study Remote Sensing and GIS.'],
    [33.5651, 73.0169, 'Rawalpindi', 'My home city.'],
    [33.7296, 73.0367, 'Faisal Mosque', 'Islamabad landmark I love to see from the hills.'],
    [33.7439, 73.0806, 'Daman-e-Koh', 'A viewpoint in the Margalla Hills for the best city view.'],
    [33.6980, 73.1260, 'Rawal Lake', 'A calm place to take a break and clear my mind.']
  ].forEach(p => {
    const m = L.marker([p[0], p[1]]).addTo(map).bindPopup(`<b>${p[2]}</b><br>${p[3]}`);
    const b = document.createElement('button');
    b.textContent = p[2];
    b.onclick = () => { map.flyTo([p[0], p[1]], 13, {duration:1.5}); m.openPopup(); };
    $('#places').appendChild(b);
  });
}