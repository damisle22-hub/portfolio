// ========== CUSTOM CURSOR ==========
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
cursor.innerHTML = `
<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0,0 0,20 5,15 9,23 12,22 8,14 14,14" fill="white" stroke="black" stroke-width="1.5"/>
</svg>`;
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.id = 'cursor-dot';
document.body.appendChild(cursorDot);

const style = document.createElement('style');
style.textContent = `
  * { cursor: none !important; }
  #custom-cursor {
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 99999;
    transform: translate(0, 0);
    filter: drop-shadow(0 0 4px rgba(16,132,208,0.8));
  }
  #cursor-dot {
    position: fixed;
    width: 4px; height: 4px;
    background: #1084d0;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px rgba(16,132,208,1);
  }
  #custom-cursor.clicking svg polygon { fill: #1084d0; }
  .resize-handle { position: absolute; z-index: 10; }
  .resize-n  { top: -4px; left: 8px; right: 8px; height: 8px; cursor: n-resize; }
  .resize-s  { bottom: -4px; left: 8px; right: 8px; height: 8px; cursor: s-resize; }
  .resize-e  { right: -4px; top: 8px; bottom: 8px; width: 8px; cursor: e-resize; }
  .resize-w  { left: -4px; top: 8px; bottom: 8px; width: 8px; cursor: w-resize; }
  .resize-ne { top: -4px; right: -4px; width: 14px; height: 14px; cursor: ne-resize; }
  .resize-nw { top: -4px; left: -4px; width: 14px; height: 14px; cursor: nw-resize; }
  .resize-se { bottom: -4px; right: -4px; width: 14px; height: 14px; cursor: se-resize; }
  .resize-sw { bottom: -4px; left: -4px; width: 14px; height: 14px; cursor: sw-resize; }

  #selection-box {
    position: fixed;
    border: 1px solid rgba(16,132,208,0.8);
    background: rgba(16,132,208,0.1);
    pointer-events: none;
    z-index: 9999;
    display: none;
  }

  .icon.selected {
    background: rgba(0,0,128,0.5) !important;
    border-color: rgba(255,255,255,0.5) !important;
  }

  /* ===== START MENU ===== */
  #start-menu {
    position: fixed;
    bottom: 42px;
    left: 0;
    width: 280px;
    background: #1a1a2e;
    border: 1px solid #3a3a6a;
    border-bottom: none;
    box-shadow: 4px -4px 20px rgba(0,0,0,0.6);
    z-index: 9000;
    font-family: 'Share Tech Mono', monospace;
    display: flex;
    flex-direction: column;
  }
  #start-menu.hidden { display: none !important; }
  .start-menu-header {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: linear-gradient(135deg, #1084d0, #000080);
    border-bottom: 1px solid #3a3a6a;
  }
  .start-avatar { width: 42px; height: 42px; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3); object-fit: cover; }
  .start-name { font-size: 0.95rem; color: #fff; font-weight: bold; font-family: 'Share Tech Mono', monospace; }
  .start-role { font-size: 0.7rem; color: rgba(255,255,255,0.7); font-family: 'Share Tech Mono', monospace; }
  .start-menu-items { padding: 0.4rem 0; flex: 1; border-bottom: 1px solid #3a3a6a; }
  .start-item {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.5rem 1.1rem; font-size: 0.82rem;
    color: #d0d0f0; cursor: pointer; transition: background 0.1s;
  }
  .start-item:hover { background: #000080; color: #fff; }
  .start-item img { width: 20px; height: 20px; object-fit: contain; }
  .start-menu-divider { height: 1px; background: #3a3a6a; margin: 0.3rem 0; }
  .start-menu-footer {
    display: flex; justify-content: space-around; align-items: center;
    padding: 0.6rem 0.5rem; background: #0f0f1e;
    border-top: 1px solid #3a3a6a; gap: 0.4rem;
  }
  .start-sys-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
    padding: 0.5rem 0.3rem; background: transparent; border: 1px solid #3a3a6a;
    border-radius: 4px; color: #a0a0c0; font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .start-sys-btn:hover { background: #1a1a4a; color: #fff; border-color: #5a5aaa; }
  .start-sys-btn.shutdown:hover { background: #3a0000; color: #ff4444; border-color: #aa0000; }
  .start-sys-btn .sys-btn-icon { font-size: 1.1rem; }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

// ========== SOUND SYSTEM ==========
let audioCtx = null;
let audioUnlocked = false;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Unlock audio on first user interaction
document.addEventListener('click', () => {
  if (!audioUnlocked) {
    getAudioCtx();
    audioUnlocked = true;
  }
}, { once: true });

function playTone(params) {
  if (!audioUnlocked) return;
  try {
    const ctx = getAudioCtx();
    const { frequency = 440, endFrequency, type = 'sine', duration = 0.15, volume = 0.15, delay = 0 } = params;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    if (endFrequency) {
      oscillator.frequency.linearRampToValueAtTime(endFrequency, ctx.currentTime + delay + duration);
    }

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch(e) {}
}

const sounds = {
  // Window open — quick rising blip
  windowOpen: () => {
    playTone({ frequency: 440, endFrequency: 660, type: 'sine', duration: 0.12, volume: 0.12 });
  },

  // Window close — quick falling blip
  windowClose: () => {
    playTone({ frequency: 520, endFrequency: 320, type: 'sine', duration: 0.12, volume: 0.10 });
  },

  // Window minimize — soft descending tone
  windowMinimize: () => {
    playTone({ frequency: 480, endFrequency: 280, type: 'sine', duration: 0.18, volume: 0.09 });
  },

  // Trash — thud/drop
  trash: () => {
    playTone({ frequency: 180, endFrequency: 80, type: 'triangle', duration: 0.2, volume: 0.18 });
    playTone({ frequency: 120, endFrequency: 60, type: 'sine', duration: 0.25, volume: 0.10, delay: 0.05 });
  },

  // Empty trash — whoosh sweep
  emptyTrash: () => {
    playTone({ frequency: 800, endFrequency: 200, type: 'sawtooth', duration: 0.35, volume: 0.08 });
    playTone({ frequency: 600, endFrequency: 150, type: 'triangle', duration: 0.4, volume: 0.06, delay: 0.05 });
  },

  // Boot chime — warm ascending chord
  boot: () => {
    playTone({ frequency: 261, endFrequency: 330, type: 'sine', duration: 0.5, volume: 0.14 });
    playTone({ frequency: 329, endFrequency: 415, type: 'sine', duration: 0.5, volume: 0.10, delay: 0.1 });
    playTone({ frequency: 392, endFrequency: 494, type: 'sine', duration: 0.6, volume: 0.08, delay: 0.2 });
  },

    login: () => {
    playTone({ frequency: 880, endFrequency: 1100, type: 'sine', duration: 0.10, volume: 0.10 });
    playTone({ frequency: 1320, endFrequency: 1560, type: 'sine', duration: 0.12, volume: 0.07, delay: 0.08 });
  },
  // Notification ping
  notify: () => {
    playTone({ frequency: 880, endFrequency: 1100, type: 'sine', duration: 0.08, volume: 0.12 });
    playTone({ frequency: 1100, endFrequency: 880, type: 'sine', duration: 0.12, volume: 0.08, delay: 0.09 });
  },

  // Error buzz
  error: () => {
    playTone({ frequency: 220, endFrequency: 180, type: 'square', duration: 0.15, volume: 0.08 });
    playTone({ frequency: 180, endFrequency: 140, type: 'square', duration: 0.15, volume: 0.06, delay: 0.16 });
  },

  // Shutdown — descending ominous tone
  shutdown: () => {
    playTone({ frequency: 440, endFrequency: 110, type: 'sine', duration: 1.2, volume: 0.14 });
    playTone({ frequency: 330, endFrequency: 82, type: 'sine', duration: 1.4, volume: 0.08, delay: 0.1 });
  },

  // Restart — quick whoosh up
  restart: () => {
    playTone({ frequency: 200, endFrequency: 800, type: 'sine', duration: 0.4, volume: 0.12 });
  },

  // Sleep — gentle fade out
  sleep: () => {
    playTone({ frequency: 330, endFrequency: 165, type: 'sine', duration: 0.8, volume: 0.10 });
    playTone({ frequency: 220, endFrequency: 110, type: 'sine', duration: 1.0, volume: 0.06, delay: 0.2 });
  },
};

// ========== BIOS SCREEN ==========
const biosLines = [
  { text: 'DI/OS BIOS v1.0.0 — Copyright 2026 Daiyan Islam', color: '#ffffff' },
  { text: '', color: '' },
  { text: 'CPU: McGill EE Cortex @ 3.6GHz', color: '#aaaaaa' },
  { text: 'Memory Test: 16384MB OK', color: '#aaaaaa' },
  { text: '', color: '' },
  { text: 'Detecting primary drives...', color: '#aaaaaa' },
  { text: '  [DRIVE 0] Experience.exe .............. OK', color: '#00ff00' },
  { text: '  [DRIVE 1] Skills.exe .................. OK', color: '#00ff00' },
  { text: '  [DRIVE 2] Projects.exe ................ OK', color: '#00ff00' },
  { text: '  [DRIVE 3] Contact.exe ................. OK', color: '#00ff00' },
  { text: '', color: '' },
  { text: 'Loading DI/OS v1.0 ...', color: '#1084d0' },
];

function runBios() {
  return new Promise(resolve => {
    const biosScreen = document.createElement('div');
    biosScreen.id = 'bios-screen';
    biosScreen.style.cssText = `
      position:fixed; inset:0; background:#000; z-index:10000;
      font-family:'Share Tech Mono',monospace; font-size:0.82rem;
      padding:2rem; color:#aaaaaa; overflow:hidden;
    `;
    const header = document.createElement('div');
    header.style.cssText = 'color:#fff; border-bottom:1px solid #333; padding-bottom:0.75rem; margin-bottom:1rem;';
    header.innerHTML = `<span style="color:#1084d0">DI/OS</span> System BIOS — Press F2 to enter setup`;
    biosScreen.appendChild(header);
    document.body.appendChild(biosScreen);

    let i = 0;
    const lineInterval = setInterval(() => {
      if (i >= biosLines.length) {
        clearInterval(lineInterval);
        setTimeout(() => {
          biosScreen.style.transition = 'opacity 0.4s';
          biosScreen.style.opacity = '0';
          setTimeout(() => { biosScreen.remove(); resolve(); }, 400);
        }, 600);
        return;
      }
      const line = document.createElement('div');
      line.style.cssText = `color:${biosLines[i].color || '#aaaaaa'}; margin-bottom:0.2rem;`;
      line.textContent = biosLines[i].text || '\u00A0';
      biosScreen.appendChild(line);
      i++;
    }, 120);
  });
}

// ========== BOOT SCREEN ==========
const bootMessages = [
  'Initializing kernel...',
  'Loading system drivers...',
  'Mounting file system...',
  'Starting network services...',
  'Loading user profile: Daiyan Islam...',
  'Applying desktop settings...',
  'Starting desktop environment...',
  'Welcome to DI/OS v1.0',
];

function runBoot() {
  return new Promise(resolve => {
    const bootScreen = document.getElementById('boot-screen');
    const bootFill = document.getElementById('boot-fill');
    const bootMsg = document.getElementById('boot-msg');
    const bootPercent = document.getElementById('boot-percent');
    bootScreen.classList.remove('hidden');
    bootScreen.style.opacity = '1';

    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 14 + 4;
      if (progress > 100) progress = 100;
      bootFill.style.width = progress + '%';
      if (bootPercent) bootPercent.textContent = Math.floor(progress) + '%';
      if (msgIndex < bootMessages.length) {
        bootMsg.textContent = bootMessages[msgIndex];
        msgIndex++;
      }
      if (progress >= 100) {
        clearInterval(interval);
        
        setTimeout(() => {
          bootScreen.style.transition = 'opacity 0.5s ease';
          bootScreen.style.opacity = '0';
          setTimeout(() => {
            bootScreen.classList.add('hidden');
            bootScreen.style.opacity = '';
            resolve();
          }, 500);
        }, 700);
      }
    }, 320);
  });
}

// ========== SYSTEM ACTIONS ==========
function refreshDesktop() {
  const icons = document.querySelectorAll('.icon');
  icons.forEach(icon => {
    icon.style.transition = 'opacity 0.15s ease';
    icon.style.opacity = '0';
  });
  setTimeout(() => {
    icons.forEach(icon => { icon.style.opacity = '1'; });
    setTimeout(() => { icons.forEach(icon => { icon.style.transition = ''; }); }, 200);
  }, 180);
}

function restartSystem() {
  sounds.restart();

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:#000;
    z-index:99999;
    opacity:0;
    transition:opacity 0.5s;
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);

  setTimeout(async () => {
    overlay.remove();
    await runStartupSequence();
    
  }, 650);
}
async function runStartupSequence() {
  const desktop = document.getElementById('desktop');

  desktop.classList.add('hidden');

  await runBios();
  await runBoot();
  await showLoginScreen();

  desktop.classList.remove('hidden');
}
function sleepSystem() {
  sounds.sleep();
  const sleepOverlay = document.createElement('div');
  sleepOverlay.id = 'sleep-overlay';
  sleepOverlay.style.cssText = `
    position:fixed; inset:0; background:#000; z-index:99999; opacity:0; transition:opacity 0.8s;
    display:flex; align-items:center; justify-content:center;
  `;
  const sleepDot = document.createElement('div');
  sleepDot.style.cssText = `
    width:8px; height:8px; border-radius:50%; background:#1084d0;
    animation:sleepPulse 3s ease-in-out infinite;
    box-shadow:0 0 12px rgba(16,132,208,0.8);
  `;
  const sleepStyle = document.createElement('style');
  sleepStyle.textContent = `
    @keyframes sleepPulse {
      0%,100% { opacity:0.2; transform:scale(0.8); }
      50% { opacity:1; transform:scale(1.2); }
    }
  `;
  document.head.appendChild(sleepStyle);
  sleepOverlay.appendChild(sleepDot);
  document.body.appendChild(sleepOverlay);
  setTimeout(() => { sleepOverlay.style.opacity = '1'; }, 10);

  const wake = () => {
    sounds.notify();
    sleepOverlay.style.opacity = '0';
    setTimeout(() => { sleepOverlay.remove(); sleepStyle.remove(); }, 800);
    document.removeEventListener('click', wake);
    document.removeEventListener('keydown', wake);
  };
  setTimeout(() => {
    document.addEventListener('click', wake);
    document.addEventListener('keydown', wake);
  }, 1000);
}

function shutDownSystem() {
  sounds.shutdown();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; background:#000; z-index:99999; opacity:0; transition:opacity 0.8s;
    display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1.5rem;
  `;
  const msg = document.createElement('div');
  msg.style.cssText = `font-family:'Share Tech Mono',monospace; font-size:1rem; color:#00cc00; text-align:center; opacity:0; transition:opacity 0.5s;`;
  msg.textContent = 'It is now safe to turn off your computer.';
  const subMsg = document.createElement('div');
  subMsg.style.cssText = `font-family:'Share Tech Mono',monospace; font-size:0.7rem; color:#006600; text-align:center; opacity:0; transition:opacity 0.5s;`;
  subMsg.textContent = 'Click anywhere to restart.';
  overlay.appendChild(msg);
  overlay.appendChild(subMsg);
  document.body.appendChild(overlay);
  setTimeout(() => { overlay.style.opacity = '1'; }, 10);
  setTimeout(() => { msg.style.opacity = '1'; }, 900);
  setTimeout(() => { subMsg.style.opacity = '1'; }, 1400);
  const restart = async () => {
  overlay.remove();
  document.removeEventListener('click', restart);

  await runStartupSequence();
  
};
  setTimeout(() => { document.addEventListener('click', restart); }, 1500);
}

// ========== STARFIELD ==========
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2, speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random() * 0.7 + 0.1, twinkle: Math.random() * Math.PI * 2,
  }));
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += 0.02;
      const o = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${o})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

// ========== CLOCK ==========
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('taskbar-clock');
  if (el) el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// ========== WINDOW MANAGEMENT ==========
let zCounter = 200;
const openWindows = {};

const windowTitles = {
  about: 'About', skills: 'Skills', experience: 'Experience',
  projects: 'Projects', contact: 'Contact', resume: 'Resume.pdf',
  recyclebin: 'Trash',
};

const windowIcons = {
  about: '📁', skills: '📁', experience: '📁',
  projects: '📁', contact: '📁', resume: '📄', recyclebin: '🗑️',
};

function openWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.classList.remove('hidden');
  win.style.display = 'flex';
  win.style.flexDirection = 'column';
  win.style.animation = 'none';
  void win.offsetWidth;
  win.style.animation = 'windowOpen 0.15s ease-out';
  bringToFront(win);
  openWindows[id] = true;
  updateTaskbar();
  sounds.windowOpen();
}

function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  sounds.windowClose();
  win.style.animation = 'windowClose 0.12s ease-in forwards';
  setTimeout(() => {
    win.classList.add('hidden');
    win.style.animation = '';
    delete openWindows[id];
    updateTaskbar();
  }, 120);
}

function minimizeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  sounds.windowMinimize();
  win.style.animation = 'windowMinimize 0.15s ease-in forwards';
  setTimeout(() => {
    win.style.display = 'none';
    win.style.animation = '';
    openWindows[id] = 'minimized';
    updateTaskbar();
  }, 150);
}

function bringToFront(win) {
  zCounter++;
  win.style.zIndex = zCounter;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
}

function updateTaskbar() {
  const bar = document.getElementById('taskbar-windows');
  bar.innerHTML = '';
  Object.keys(openWindows).forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'taskbar-btn';
    const isMinimized = openWindows[id] === 'minimized';
    btn.textContent = `${windowIcons[id]} ${windowTitles[id]}`;
    if (!isMinimized) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const win = document.getElementById(`win-${id}`);
      if (!win) return;
      if (openWindows[id] === 'minimized') {
        win.style.display = 'flex';
        win.style.flexDirection = 'column';
        openWindows[id] = true;
        bringToFront(win);
        sounds.windowOpen();
      } else if (win.classList.contains('active')) {
        minimizeWindow(id);
      } else {
        bringToFront(win);
      }
      updateTaskbar();
    });
    bar.appendChild(btn);
  });
}

const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes windowClose {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.85); opacity: 0; }
  }
  @keyframes windowMinimize {
    0% { transform: scale(1) translateY(0); opacity: 1; }
    100% { transform: scale(0.3) translateY(200px); opacity: 0; }
  }
`;
document.head.appendChild(animStyle);

// ========== RESIZABLE WINDOWS ==========
function makeResizable(win) {
  const minW = 420, minH = 280;
  const dirs = ['n','s','e','w','ne','nw','se','sw'];
  dirs.forEach(dir => {
    const h = document.createElement('div');
    h.className = `resize-handle resize-${dir}`;
    h.dataset.resize = dir;
    win.appendChild(h);
  });
  let resizing = false, resizeDir = '';
  let startX, startY, startW, startH, startLeft, startTop;
  win.addEventListener('mousedown', (e) => {
    const dir = e.target.dataset.resize;
    if (!dir) return;
    if (win.dataset.maximized === 'true') return;
    resizing = true; resizeDir = dir;
    startX = e.clientX; startY = e.clientY;
    startW = win.offsetWidth; startH = win.offsetHeight;
    startLeft = win.offsetLeft; startTop = win.offsetTop;
    bringToFront(win); e.preventDefault(); e.stopPropagation();
  });
  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (resizeDir.includes('e')) { win.style.width = Math.max(minW, startW + dx) + 'px'; win.style.maxWidth = 'none'; }
    if (resizeDir.includes('s')) {
      const newH = Math.max(minH, startH + dy);
      win.style.height = newH + 'px';
      const body = win.querySelector('.window-body');
      if (body) body.style.maxHeight = Math.max(100, newH - 100) + 'px';
    }
    if (resizeDir.includes('w')) {
      const newW = Math.max(minW, startW - dx);
      win.style.width = newW + 'px'; win.style.maxWidth = 'none';
      win.style.left = (startLeft + startW - newW) + 'px';
    }
    if (resizeDir.includes('n')) {
      const newH = Math.max(minH, startH - dy);
      win.style.height = newH + 'px';
      win.style.top = (startTop + startH - newH) + 'px';
      const body = win.querySelector('.window-body');
      if (body) body.style.maxHeight = Math.max(100, newH - 100) + 'px';
    }
  });
  document.addEventListener('mouseup', () => { resizing = false; });
}

// ========== TRASH ==========
const recycleBin = [];

function sendToRecycleBin(icon) {
  if (icon.id === 'recycle-bin') return;
  const id = icon.dataset.window;
  const label = icon.querySelector('.icon-label').textContent;
  const iconImg = icon.querySelector('.icon-img').innerHTML;
  const left = icon.style.left;
  const top = icon.style.top;
  recycleBin.push({ id, label, iconImg, left, top, iconEl: icon });
  icon.style.display = 'none';
  const binImg = document.getElementById('bin-img');
  if (binImg) binImg.src = 'assets/trash-full.png';
  sounds.trash();
  updateRecycleBinWindow();
}

function updateRecycleBinWindow() {
  const itemsEl = document.getElementById('recycle-items');
  const emptyMsg = document.getElementById('recycle-empty-msg');
  const binCount = document.getElementById('bin-count');
  if (!itemsEl) return;
  itemsEl.innerHTML = '';
  if (recycleBin.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (binCount) binCount.textContent = '0 items';
    const binImg = document.getElementById('bin-img');
    if (binImg) binImg.src = 'assets/trash-empty.png';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (binCount) binCount.textContent = `${recycleBin.length} item${recycleBin.length > 1 ? 's' : ''}`;

  let selectedRows = new Set();

  function updateRowStyles() {
    itemsEl.querySelectorAll('.bin-row').forEach((row, i) => {
      row.style.background = selectedRows.has(i) ? '#c8d8ff' : '#ffffff';
    });
  }

  recycleBin.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'bin-row';
    row.dataset.index = index;
    row.style.cssText = `
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.5rem 0.75rem; background: #ffffff;
      border: 1px solid #d8d8e8; border-radius: 6px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.88rem; color: #1a1a3e;
      cursor: default; transition: background 0.1s; user-select: none;
    `;
    row.innerHTML = `
      <img src="assets/folder.png" style="width:24px;height:24px;object-fit:contain;pointer-events:none;">
      <span style="flex:1;">${item.label}</span>
      <span style="font-size:0.72rem; color:#888899;">Deleted</span>
    `;
    row.addEventListener('click', (e) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        if (selectedRows.has(index)) selectedRows.delete(index);
        else selectedRows.add(index);
      } else {
        selectedRows.clear();
        selectedRows.add(index);
      }
      updateRowStyles();
    });
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (!selectedRows.has(index)) {
        selectedRows.clear(); selectedRows.add(index); updateRowStyles();
      }
      const isMulti = selectedRows.size > 1;
      showContextMenu(e.clientX, e.clientY, [
        {
          label: isMulti ? `♻️ Restore ${selectedRows.size} items` : '♻️ Restore',
          action: () => {
            const toRestore = [...selectedRows].sort((a, b) => b - a);
            toRestore.forEach(i => restoreFromBin(i));
            selectedRows.clear();
          }
        },
        { label: 'separator' },
        {
          label: isMulti ? `❌ Delete ${selectedRows.size} permanently` : '❌ Delete Permanently',
          action: () => {
            const toDelete = [...selectedRows].sort((a, b) => b - a);
            toDelete.forEach(i => recycleBin.splice(i, 1));
            selectedRows.clear();
            updateRecycleBinWindow();
          }
        },
      ]);
    });
    itemsEl.appendChild(row);
  });

  // DRAG SELECT INSIDE TRASH
  const windowBody = document.getElementById('recycle-bin-body');
  if (!windowBody) return;
  let trashSelBox = windowBody.querySelector('#trash-sel-box');
  if (!trashSelBox) {
    trashSelBox = document.createElement('div');
    trashSelBox.id = 'trash-sel-box';
    trashSelBox.style.cssText = `position:absolute; border:1px solid rgba(16,132,208,0.8); background:rgba(16,132,208,0.1); pointer-events:none; z-index:9999; display:none;`;
    windowBody.style.position = 'relative';
    windowBody.appendChild(trashSelBox);
  }
  let trashDragging = false, trashStartX = 0, trashStartY = 0, wasTrashSelecting = false;
  windowBody.addEventListener('mousedown', (e) => {
    if (e.target.closest('.bin-row')) return;
    if (e.button !== 0) return;
    trashDragging = true; wasTrashSelecting = false;
    const rect = windowBody.getBoundingClientRect();
    trashStartX = e.clientX - rect.left + windowBody.scrollLeft;
    trashStartY = e.clientY - rect.top + windowBody.scrollTop;
    trashSelBox.style.display = 'block';
    trashSelBox.style.left = trashStartX + 'px';
    trashSelBox.style.top = trashStartY + 'px';
    trashSelBox.style.width = '0px';
    trashSelBox.style.height = '0px';
    selectedRows.clear(); updateRowStyles();
  });
  document.addEventListener('mousemove', (e) => {
    if (!trashDragging) return;
    const rect = windowBody.getBoundingClientRect();
    const curX = e.clientX - rect.left + windowBody.scrollLeft;
    const curY = e.clientY - rect.top + windowBody.scrollTop;
    if (Math.abs(curX - trashStartX) > 4 || Math.abs(curY - trashStartY) > 4) wasTrashSelecting = true;
    const x = Math.min(curX, trashStartX), y = Math.min(curY, trashStartY);
    const w = Math.abs(curX - trashStartX), h = Math.abs(curY - trashStartY);
    trashSelBox.style.left = x + 'px'; trashSelBox.style.top = y + 'px';
    trashSelBox.style.width = w + 'px'; trashSelBox.style.height = h + 'px';
    const selRect = {
      left: x + rect.left - windowBody.scrollLeft, top: y + rect.top - windowBody.scrollTop,
      right: x + w + rect.left - windowBody.scrollLeft, bottom: y + h + rect.top - windowBody.scrollTop,
    };
    selectedRows.clear();
    itemsEl.querySelectorAll('.bin-row').forEach((row) => {
      const r = row.getBoundingClientRect();
      if (r.left < selRect.right && r.right > selRect.left && r.top < selRect.bottom && r.bottom > selRect.top)
        selectedRows.add(parseInt(row.dataset.index));
    });
    updateRowStyles();
  });
  document.addEventListener('mouseup', () => {
    if (trashDragging) { trashDragging = false; trashSelBox.style.display = 'none'; }
  });
  windowBody.addEventListener('click', (e) => {
    if (!e.target.closest('.bin-row') && !wasTrashSelecting) { selectedRows.clear(); updateRowStyles(); }
    wasTrashSelecting = false;
  });
}

function restoreFromBin(index) {
  const item = recycleBin[index];
  const restoredCount = document.querySelectorAll('.icon[data-restored="true"]').length;
  item.iconEl.style.display = 'flex';
  item.iconEl.style.left = `${window.innerWidth - 160}px`;
  item.iconEl.style.top = `${20 + restoredCount * 160}px`;
  item.iconEl.dataset.restored = 'true';
  recycleBin.splice(index, 1);
  sounds.notify();
  updateRecycleBinWindow();
}

function emptyRecycleBin() {
  if (recycleBin.length === 0) return;
  if (confirm('Permanently delete all items in the Trash?')) {
    recycleBin.length = 0;
    sounds.emptyTrash();
    updateRecycleBinWindow();
  }
}

// ========== SELECTION BOX ==========
const selectionBox = document.createElement('div');
selectionBox.id = 'selection-box';
document.body.appendChild(selectionBox);

let isSelecting = false, selStartX = 0, selStartY = 0;
let isMultiDragging = false, multiDragStartX = 0, multiDragStartY = 0;
let iconStartPositions = new Map();

function getSelectedIcons() {
  return [...document.querySelectorAll('.icon.selected')];
}

function initSelectionBox() {
  const desktop = document.getElementById('desktop');
  let wasSelecting = false;

  desktop.addEventListener('mousedown', (e) => {
    if (e.target.closest('.icon') || e.target.closest('.window') || e.target.closest('#taskbar') ||
        e.target.closest('#context-menu') || e.target.closest('#sys-monitor') || e.target.closest('#start-menu')) return;
    if (e.button !== 0) return;
    isSelecting = true; wasSelecting = false;
    selStartX = e.clientX; selStartY = e.clientY;
    selectionBox.style.display = 'block';
    selectionBox.style.left = selStartX + 'px'; selectionBox.style.top = selStartY + 'px';
    selectionBox.style.width = '0px'; selectionBox.style.height = '0px';
    if (!e.shiftKey && !e.metaKey && !e.ctrlKey)
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  });

  document.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    const dx = Math.abs(e.clientX - selStartX), dy = Math.abs(e.clientY - selStartY);
    if (dx > 4 || dy > 4) wasSelecting = true;
    const x = Math.min(e.clientX, selStartX), y = Math.min(e.clientY, selStartY);
    const w = Math.abs(e.clientX - selStartX), h = Math.abs(e.clientY - selStartY);
    selectionBox.style.left = x + 'px'; selectionBox.style.top = y + 'px';
    selectionBox.style.width = w + 'px'; selectionBox.style.height = h + 'px';
    const selRect = { left: x, top: y, right: x + w, bottom: y + h };
    document.querySelectorAll('.icon').forEach(icon => {
      if (icon.style.display === 'none') return;
      const r = icon.getBoundingClientRect();
      icon.classList.toggle('selected',
        r.left < selRect.right && r.right > selRect.left && r.top < selRect.bottom && r.bottom > selRect.top);
    });
  });

  document.addEventListener('mouseup', () => {
    if (isSelecting) {
      isSelecting = false;
      selectionBox.style.display = 'none';
      selectionBox.style.width = '0'; selectionBox.style.height = '0';
    }
  });

  desktop.addEventListener('click', (e) => {
    if (e.target.closest('.icon') || e.target.closest('.window') ||
        e.target.closest('#taskbar') || e.target.closest('#sys-monitor')) return;
    if (wasSelecting) { wasSelecting = false; return; }
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  });
}

// ========== DRAGGABLE ICONS ==========
function makeIconDraggable(icon) {
  let dragging = false, startX, startY, startLeft, startTop, hasMoved = false;

  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true; hasMoved = false;
    startX = e.clientX; startY = e.clientY;
    startLeft = icon.offsetLeft; startTop = icon.offsetTop;
    icon.style.zIndex = 500; icon.dataset.dragging = 'true';
    e.preventDefault();
    if (icon.classList.contains('selected')) {
      const selected = getSelectedIcons();
      if (selected.length > 1) {
        isMultiDragging = true;
        multiDragStartX = e.clientX; multiDragStartY = e.clientY;
        iconStartPositions.clear();
        selected.forEach(ic => { iconStartPositions.set(ic, { left: ic.offsetLeft, top: ic.offsetTop }); ic.style.zIndex = 500; });
      }
    } else {
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      isMultiDragging = false;
    }
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    hasMoved = true;
    if (isMultiDragging) {
      const mdx = e.clientX - multiDragStartX, mdy = e.clientY - multiDragStartY;
      iconStartPositions.forEach((pos, ic) => {
        ic.style.left = `${pos.left + mdx}px`; ic.style.top = `${pos.top + mdy}px`;
      });
    } else {
      icon.style.left = `${startLeft + (e.clientX - startX)}px`;
      icon.style.top = `${startTop + (e.clientY - startY)}px`;
    }
    const binIcon = document.getElementById('recycle-bin');
    if (binIcon && icon !== binIcon) {
      const binRect = binIcon.getBoundingClientRect();
      const overBin = e.clientX >= binRect.left && e.clientX <= binRect.right && e.clientY >= binRect.top && e.clientY <= binRect.bottom;
      binIcon.style.background = overBin ? 'rgba(200,0,0,0.25)' : '';
      binIcon.style.borderColor = overBin ? 'rgba(200,0,0,0.6)' : '';
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false; icon.style.zIndex = ''; icon.dataset.dragging = 'false';
    isMultiDragging = false;
    iconStartPositions.forEach((_, ic) => { ic.style.zIndex = ''; });
    const binIcon = document.getElementById('recycle-bin');
    if (binIcon && icon !== binIcon && hasMoved) {
      const binRect = binIcon.getBoundingClientRect();
      const overBin = e.clientX >= binRect.left && e.clientX <= binRect.right && e.clientY >= binRect.top && e.clientY <= binRect.bottom;
      if (overBin) {
        binIcon.style.background = ''; binIcon.style.borderColor = '';
        const selected = getSelectedIcons();
        if (selected.length > 1) selected.forEach(ic => { if (ic.id !== 'recycle-bin') sendToRecycleBin(ic); });
        else sendToRecycleBin(icon);
      }
    }
  });
}

// ========== ICON CLICK ==========
function initIcons() {
  const icons = document.querySelectorAll('.icon');
  const startX = 20, startY = 20;
  const availableHeight = window.innerHeight - 42 - startY;
  const spacingY = Math.min(160, Math.floor(availableHeight / icons.length));
  icons.forEach((icon, i) => {
    icon.style.position = 'absolute';
    icon.style.left = `${startX}px`;
    icon.style.top = `${startY + i * spacingY}px`;
    makeIconDraggable(icon);
    let clickCount = 0, clickTimer = null, moved = false;
    icon.addEventListener('mousedown', () => { moved = false; });
    icon.addEventListener('mousemove', () => { moved = true; });
    icon.addEventListener('click', (e) => {
      if (moved) return;
      e.stopPropagation();
      clickCount++;
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
        if (!icon.classList.contains('selected'))
          document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      }
      icon.classList.add('selected');
      if (clickCount === 1) {
        clickTimer = setTimeout(() => { clickCount = 0; }, 400);
      } else if (clickCount >= 2) {
        clearTimeout(clickTimer); clickCount = 0;
        openWindow(icon.dataset.window);
      }
    });
  });
}

// ========== WINDOW CONTROLS ==========
function initWindowControls() {
  document.querySelectorAll('.win-btn.close').forEach(btn => {
    btn.addEventListener('click', () => closeWindow(btn.dataset.target.replace('win-', '')));
  });
  document.querySelectorAll('.win-btn.minimize').forEach(btn => {
    btn.addEventListener('click', () => minimizeWindow(btn.dataset.target.replace('win-', '')));
  });
  document.querySelectorAll('.win-btn.maximize').forEach(btn => {
    btn.addEventListener('click', () => {
      const win = document.getElementById(btn.dataset.target);
      if (!win) return;
      const body = win.querySelector('.window-body');
      if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.prevWidth || '820px';
        win.style.height = win.dataset.prevHeight || 'auto';
        win.style.top = win.dataset.prevTop || '80px';
        win.style.left = win.dataset.prevLeft || '160px';
        win.style.maxWidth = ''; win.style.borderRadius = '';
        if (body) body.style.maxHeight = '620px';
        win.dataset.maximized = 'false';
      } else {
        win.dataset.prevWidth = win.style.width || '820px';
        win.dataset.prevHeight = win.style.height || '';
        win.dataset.prevTop = win.style.top || '80px';
        win.dataset.prevLeft = win.style.left || '160px';
        win.style.top = '0'; win.style.left = '0';
        win.style.width = '100vw'; win.style.height = 'calc(100vh - 42px)';
        win.style.maxWidth = '100vw'; win.style.borderRadius = '0';
        if (body) body.style.maxHeight = 'calc(100vh - 120px)';
        win.dataset.maximized = 'true';
      }
      bringToFront(win);
    });
  });
}

// ========== WINDOW DRAG ==========
function initWindowDrag() {
  document.querySelectorAll('.window-titlebar').forEach(titlebar => {
    const win = titlebar.closest('.window');
    let dragging = false, startX, startY, startLeft, startTop;
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('win-btn')) return;
      if (win.dataset.maximized === 'true') return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startLeft = parseInt(win.style.left) || win.offsetLeft;
      startTop = parseInt(win.style.top) || win.offsetTop;
      bringToFront(win); e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      win.style.left = `${startLeft + (e.clientX - startX)}px`;
      win.style.top = `${startTop + (e.clientY - startY)}px`;
    });
    document.addEventListener('mouseup', () => { dragging = false; });
  });
  document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
  });
}

// ========== RIGHT CLICK CONTEXT MENU ==========
const contextMenu = document.createElement('div');
contextMenu.id = 'context-menu';
contextMenu.style.cssText = `
  position: fixed; background: #f0f0f4;
  border-top: 2px solid #5a5a8a; border-left: 2px solid #5a5a8a;
  border-right: 2px solid #1a1a35; border-bottom: 2px solid #1a1a35;
  min-width: 190px; z-index: 99000; display: none;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.4);
  font-family: 'Share Tech Mono', monospace;
`;

const desktopMenuItems = [
  { label: '🔄 Refresh Desktop', action: refreshDesktop },
  { label: '📐 Arrange Icons', action: arrangeIcons },
  { label: 'separator' },
  { label: '📁 Open About', action: () => openWindow('about') },
  { label: '📁 Open Skills', action: () => openWindow('skills') },
  { label: '📁 Open Experience', action: () => openWindow('experience') },
  { label: '📁 Open Projects', action: () => openWindow('projects') },
  { label: '📁 Open Contact', action: () => openWindow('contact') },
  { label: 'separator' },
  { label: '🖥️ About DI/OS', action: showAboutDIOS },
];

function buildContextMenu(items) {
  contextMenu.innerHTML = '';
  items.forEach(item => {
    if (item.label === 'separator') {
      const sep = document.createElement('div');
      sep.style.cssText = 'height:1px; background:#c0c0d0; margin:3px 6px;';
      contextMenu.appendChild(sep); return;
    }
    const el = document.createElement('div');
    el.textContent = item.label;
    el.style.cssText = `padding:0.35rem 1.1rem; font-size:0.8rem; color:#1a1a3e; cursor:pointer; white-space:nowrap;`;
    el.addEventListener('mouseenter', () => { el.style.background = '#000080'; el.style.color = '#fff'; });
    el.addEventListener('mouseleave', () => { el.style.background = ''; el.style.color = '#1a1a3e'; });
    el.addEventListener('click', () => { hideContextMenu(); item.action(); });
    contextMenu.appendChild(el);
  });
}

function showContextMenu(x, y, items) {
  buildContextMenu(items);
  contextMenu.style.display = 'block';
  const menuW = 200, menuH = items.length * 30;
  contextMenu.style.left = (x + menuW > window.innerWidth ? x - menuW : x) + 'px';
  contextMenu.style.top = (y + menuH > window.innerHeight ? y - menuH : y) + 'px';
}

function hideContextMenu() { contextMenu.style.display = 'none'; }
document.body.appendChild(contextMenu);

document.getElementById('desktop').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (e.target.closest('.window')) return;
  if (e.target.closest('.icon')) {
    const icon = e.target.closest('.icon');
    const id = icon.dataset.window;
    if (id === 'recyclebin') {
      showContextMenu(e.clientX, e.clientY, [
        { label: '🗑️ Open Trash', action: () => openWindow('recyclebin') },
        { label: 'separator' },
        { label: '💥 Empty Trash', action: () => emptyRecycleBin() },
      ]); return;
    }
    const selected = getSelectedIcons();
    if (selected.length > 1 && icon.classList.contains('selected')) {
      showContextMenu(e.clientX, e.clientY, [
        { label: `📂 Open all selected`, action: () => selected.forEach(ic => openWindow(ic.dataset.window)) },
        { label: 'separator' },
        { label: '🗑️ Send all to Trash', action: () => selected.forEach(ic => { if (ic.id !== 'recycle-bin') sendToRecycleBin(ic); }) },
      ]); return;
    }
    showContextMenu(e.clientX, e.clientY, [
      { label: `📂 Open ${windowTitles[id]}`, action: () => openWindow(id) },
      { label: 'separator' },
      { label: '✏️ Rename', action: () => renameIcon(icon) },
      { label: '🗑️ Send to Trash', action: () => sendToRecycleBin(icon) },
    ]); return;
  }
  showContextMenu(e.clientX, e.clientY, desktopMenuItems);
});

document.addEventListener('click', hideContextMenu);

function arrangeIcons() {
  const icons = document.querySelectorAll('.icon');
  const startX = 20, startY = 20;
  const availableHeight = window.innerHeight - 42 - startY;
  const spacingY = Math.min(160, Math.floor(availableHeight / icons.length));
  icons.forEach((icon, i) => {
    icon.style.transition = 'top 0.3s ease, left 0.3s ease';
    icon.style.left = `${startX}px`;
    icon.style.top = `${startY + i * spacingY}px`;
    setTimeout(() => { icon.style.transition = ''; }, 350);
  });
}

function renameIcon(icon) {
  const label = icon.querySelector('.icon-label');
  const current = label.textContent;
  const input = document.createElement('input');
  input.value = current;
  input.style.cssText = `width:100px; font-size:0.8rem; font-family:'Share Tech Mono',monospace; text-align:center; border:1px solid #000080; background:white; color:black; padding:2px 4px;`;
  label.innerHTML = '';
  label.appendChild(input);
  input.focus(); input.select();
  input.addEventListener('blur', () => { label.textContent = input.value || current; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') { label.textContent = current; }
  });
}

function showAboutDIOS() {
  const existing = document.getElementById('win-dios');
  if (existing) { existing.remove(); }
  const win = document.createElement('div');
  win.className = 'window active';
  win.id = 'win-dios';
  win.style.cssText = 'top:150px; left:350px; width:320px;';
  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title"><span class="title-icon">🖥️</span> About DI/OS</div>
      <div class="window-controls">
        <button class="win-btn close" onclick="this.closest('.window').remove()">✕</button>
      </div>
    </div>
    <div class="window-body" style="text-align:center; padding:2rem 1.5rem; background:#f2f2f6;">
      <div style="font-family:'VT323',monospace; font-size:3rem; color:#000080; margin-bottom:0.5rem;">DI/OS</div>
      <div style="font-family:'Share Tech Mono',monospace; font-size:0.85rem; color:#333; margin-bottom:0.25rem;">Version 1.0.0</div>
      <div style="font-family:'Share Tech Mono',monospace; font-size:0.82rem; color:#666; margin-bottom:1rem;">Built by Daiyan Islam · 2026</div>
      <div style="border-top:2px solid #1084d0; margin:1rem 0;"></div>
      <div style="font-family:'Share Tech Mono',monospace; font-size:0.82rem; color:#000080;">McGill EE · EY Consulting · Montreal, QC</div>
    </div>
    <div class="window-statusbar"><span>DI/OS v1.0</span><span>© 2026</span></div>
  `;
  document.getElementById('desktop').appendChild(win);
  bringToFront(win);
  makeResizable(win);
}

// ========== START MENU ==========
function initStartMenu() {
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  startMenu.innerHTML = `
    <div class="start-menu-header">
      <img src="assets/profile.jpg" alt="Daiyan" class="start-avatar"/>
      <div>
        <div class="start-name">Daiyan Islam</div>
        <div class="start-role">EE Student · EY Consultant</div>
      </div>
    </div>
    <div class="start-menu-items">
      <div class="start-item" data-window="about"><img src="assets/folder.png" alt=""> About</div>
      <div class="start-item" data-window="skills"><img src="assets/folder.png" alt=""> Skills</div>
      <div class="start-item" data-window="experience"><img src="assets/folder.png" alt=""> Experience</div>
      <div class="start-item" data-window="projects"><img src="assets/folder.png" alt=""> Projects</div>
      <div class="start-item" data-window="contact"><img src="assets/folder.png" alt=""> Contact</div>
      <div class="start-menu-divider"></div>
      <div class="start-item" data-window="resume"><img src="assets/document.png" alt=""> Resume.pdf</div>
    </div>
    <div class="start-menu-footer">
      <button class="start-sys-btn" id="btn-sleep"><span class="sys-btn-icon">💤</span>Sleep</button>
      <button class="start-sys-btn" id="btn-restart"><span class="sys-btn-icon">🔄</span>Restart</button>
      <button class="start-sys-btn shutdown" id="btn-shutdown"><span class="sys-btn-icon">⏻</span>Shut Down</button>
    </div>
  `;

  startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('hidden'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) startMenu.classList.add('hidden');
  });
  startMenu.querySelectorAll('.start-item').forEach(item => {
    item.addEventListener('click', () => { openWindow(item.dataset.window); startMenu.classList.add('hidden'); });
  });
  document.getElementById('btn-sleep').addEventListener('click', () => { startMenu.classList.add('hidden'); sleepSystem(); });
  document.getElementById('btn-restart').addEventListener('click', () => { startMenu.classList.add('hidden'); restartSystem(); });
  document.getElementById('btn-shutdown').addEventListener('click', () => { startMenu.classList.add('hidden'); shutDownSystem(); });
}

// ========== SYSTEM MONITOR ==========
const sysState = { cpu: 3, ram: 8, pwr: 100, uptimeSeconds: 0, activitySpike: 0 };
let lastMouseX = 0, lastMouseY = 0, mouseVelocity = 0;
document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastMouseX, dy = e.clientY - lastMouseY;
  mouseVelocity = Math.sqrt(dx * dx + dy * dy);
  lastMouseX = e.clientX; lastMouseY = e.clientY;
});

function updateSysMonitor() {
  const openCount = Object.keys(openWindows).filter(k => openWindows[k] !== 'minimized').length;
  const targetCpu = Math.min(99, 3 + openCount * 3 + Math.min(75, mouseVelocity * 3.5) + sysState.activitySpike + (Math.random() * 12 - 6));
  sysState.cpu += (targetCpu - sysState.cpu) * 0.45;
  sysState.activitySpike *= 0.78;
  mouseVelocity *= 0.4;
  sysState.ram += (Math.min(97, 10 + openCount * 12 + Math.random() * 5 - 2) - sysState.ram) * 0.3;
  sysState.pwr = Math.max(0, sysState.pwr - (0.004 + openCount * 0.001 + (sysState.cpu / 100) * 0.008));

  const pwrBar = document.getElementById('pwr-bar');
  if (pwrBar) {
    if (sysState.pwr < 20) { pwrBar.style.background = 'linear-gradient(90deg,#aa0000,#ff4444)'; pwrBar.style.boxShadow = '0 0 6px rgba(255,50,50,0.7)'; }
    else if (sysState.pwr < 50) { pwrBar.style.background = 'linear-gradient(90deg,#aa6600,#ffaa00)'; pwrBar.style.boxShadow = '0 0 6px rgba(255,170,0,0.5)'; }
    else { pwrBar.style.background = 'linear-gradient(90deg,#00aa44,#00ff66)'; pwrBar.style.boxShadow = '0 0 6px rgba(0,255,100,0.4)'; }
  }
  const cpuPct = Math.round(Math.max(0, Math.min(100, sysState.cpu)));
  const ramPct = Math.round(Math.max(0, Math.min(100, sysState.ram)));
  const pwrPct = Math.round(sysState.pwr);
  const cpuBar = document.getElementById('cpu-bar');
  const ramBar = document.getElementById('ram-bar');
  const cpuVal = document.getElementById('cpu-val');
  const ramVal = document.getElementById('ram-val');
  const pwrVal = document.getElementById('pwr-val');
  const sysProc = document.getElementById('sys-proc');
  if (cpuBar) cpuBar.style.width = cpuPct + '%';
  if (ramBar) ramBar.style.width = ramPct + '%';
  if (pwrBar) pwrBar.style.width = pwrPct + '%';
  if (cpuVal) { cpuVal.textContent = cpuPct + '%'; cpuVal.style.color = cpuPct > 70 ? '#ff4444' : cpuPct > 40 ? '#ffaa00' : '#1084d0'; }
  if (ramVal) ramVal.textContent = ramPct + '%';
  if (pwrVal) pwrVal.textContent = pwrPct + '%';
  if (sysProc) sysProc.textContent = openCount;
}

function updateUptime() {
  sysState.uptimeSeconds++;
  const h = Math.floor(sysState.uptimeSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((sysState.uptimeSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (sysState.uptimeSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('sys-uptime');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

setInterval(updateSysMonitor, 80);
setInterval(updateUptime, 1000);

// ========== INIT ==========
async function init() {
  await runBios();
  await runBoot();

  const desktop = document.getElementById('desktop');
  desktop.classList.remove('hidden');

  // Unlock audio and play boot chime on first interaction after desktop loads
  document.addEventListener('click', () => {
    if (!audioUnlocked) { audioUnlocked = true; }
    
  }, { once: true });

  initStarfield();
  initIcons();
  initWindowControls();
  initWindowDrag();
  initStartMenu();
  initSelectionBox();

  document.querySelectorAll('.window').forEach(win => makeResizable(win));
}

// ========== INIT ==========
function showLoginScreen() {
  return new Promise(resolve => {
    const loginScreen = document.getElementById('login-screen');
    const loginBtn = document.getElementById('login-btn');

    loginScreen.classList.remove('hidden');
    loginScreen.style.opacity = '1';

    loginBtn.addEventListener('click', () => {
      getAudioCtx();
      audioUnlocked = true;

     sounds.login();

      loginScreen.style.transition = 'opacity 0.45s ease';
      loginScreen.style.opacity = '0';

      setTimeout(() => {
      loginScreen.classList.add('hidden');
      loginScreen.style.opacity = '';
      resolve();
      }, 450);
    }, { once: true });
  });
}

async function init() {
  await runStartupSequence();

  initStarfield();
  initIcons();
  initWindowControls();
  initWindowDrag();
  initStartMenu();
  initSelectionBox();

  document.querySelectorAll('.window').forEach(win => makeResizable(win));
}

init();