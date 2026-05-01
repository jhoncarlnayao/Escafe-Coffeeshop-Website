const slides = Array.from(document.querySelectorAll('.slide'));
const total = slides.length;
let cur = 0, busy = false;
const pad = n => String(n).padStart(2,'0');

const BG_IMGS = [
  'https://i.pinimg.com/736x/62/f7/d0/62f7d0ec48250067cfa25668d02a4f45.jpg',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&q=60&fit=crop',
  null,
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1500576992153-0271099def59?w=200&q=60&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=60&fit=crop',
];
const COLORS = ['#1a1208','#14130a','#1c1810','#14130a','#0e0c08','#1a1208','#14130a','#14130a','#0e0c08','#14130a','#1a1208','#0e0c08','#14130a','#0e0c08'];

const panel = document.getElementById('slide-panel');

slides.forEach((s, i) => {
  const label = s.getAttribute('data-label') || `Slide ${i+1}`;
  const img = BG_IMGS[i];
  const pDiv = document.createElement('div');
  pDiv.className = 'thumb-item' + (i===0?' active-thumb':'');
  pDiv.onclick = () => goTo(i);
  pDiv.innerHTML = `
    <div style="height:72px;background:${img ? `url(${img}) center/cover` : COLORS[i]};position:relative;">
      ${img ? `<div style="position:absolute;inset:0;background:rgba(10,8,4,.38);filter:sepia(40%) brightness(.7)"></div>` : ''}
      <span class="thumb-num" style="position:absolute;top:4px;left:5px">${pad(i+1)}</span>
    </div>
    <div class="thumb-label">${label}</div>`;
  panel.appendChild(pDiv);
});

function updateUI() {
  const lbl = `${pad(cur+1)} / ${pad(total)}`;
  document.getElementById('slide-counter').textContent = lbl;
  document.getElementById('hud-num').textContent = lbl;
  document.getElementById('progress').style.width = `${((cur+1)/total)*100}%`;
  panel.querySelectorAll('.thumb-item').forEach((el,i) => {
    el.classList.toggle('active-thumb', i===cur);
  });
  const activePanelThumb = panel.querySelectorAll('.thumb-item')[cur];
  if(activePanelThumb) activePanelThumb.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function triggerAnims(s) {
  s.classList.remove('ready');
  void s.offsetWidth;
  s.classList.add('ready');
}

function goTo(idx) {
  if(busy || idx<0 || idx>=total || idx===cur) return;
  busy = true;
  const leaving = slides[cur];
  leaving.classList.add('anim-out');
  leaving.classList.remove('active','ready');
  setTimeout(() => leaving.classList.remove('anim-out'), 460);
  cur = idx;
  const entering = slides[cur];
  entering.classList.add('active','anim-in');
  setTimeout(() => {
    entering.classList.remove('anim-in');
    triggerAnims(entering);
    busy = false;
  }, 50);
  updateUI();
}

function go(d){ goTo(cur+d); }

let panelOpen = false;
function togglePanel(){
  panelOpen = !panelOpen;
  document.getElementById('slide-panel').classList.toggle('open', panelOpen);
}

document.addEventListener('keydown', e => {
  if([' ','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();go(1);}
  if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();go(-1);}
  if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
  if(e.key==='Escape'&&panelOpen){togglePanel();}
});

document.getElementById('deck').addEventListener('click', e => {
  if(!e.target.closest('button')) go(1);
});

updateUI();
setTimeout(()=>triggerAnims(slides[0]),100);