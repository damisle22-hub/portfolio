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
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

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

// ========== STARFIELD ==========
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random() * 0.7 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
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
  recyclebin: 'Recycle Bin',
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
}

function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
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

  let resizing = false;
  let resizeDir = '';
  let startX, startY, startW, startH, startLeft, startTop;

  win.addEventListener('mousedown', (e) => {
    const dir = e.target.dataset.resize;
    if (!dir) return;
    if (win.dataset.maximized === 'true') return;
    resizing = true;
    resizeDir = dir;
    startX = e.clientX;
    startY = e.clientY;
    startW = win.offsetWidth;
    startH = win.offsetHeight;
    startLeft = win.offsetLeft;
    startTop = win.offsetTop;
    bringToFront(win);
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (resizeDir.includes('e')) { win.style.width = Math.max(minW, startW + dx) + 'px'; win.style.maxWidth = 'none'; }
    if (resizeDir.includes('s')) {
      const newH = Math.max(minH, startH + dy);
      win.style.height = newH + 'px';
      const body = win.querySelector('.window-body');
      if (body) body.style.maxHeight = Math.max(100, newH - 100) + 'px';
    }
    if (resizeDir.includes('w')) {
      const newW = Math.max(minW, startW - dx);
      win.style.width = newW + 'px';
      win.style.maxWidth = 'none';
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

// ========== RECYCLE BIN ==========
const recycleBin = [];

function sendToRecycleBin(icon) {
  if (icon.id === 'recycle-bin') return;
  const id = icon.dataset.window;
  const label = icon.querySelector('.icon-label').textContent;
  const iconImg = icon.querySelector('.icon-img').textContent;
  const left = icon.style.left;
  const top = icon.style.top;

  recycleBin.push({ id, label, iconImg, left, top, iconEl: icon });
  icon.style.display = 'none';

  const binIconEl = document.getElementById('bin-icon');
  if (binIconEl) {
    binIconEl.textContent = '🗑️';
    binIconEl.style.filter = 'sepia(1) saturate(3) hue-rotate(0deg)';
  }
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
    const binIconEl = document.getElementById('bin-icon');
    if (binIconEl) { binIconEl.textContent = '🗑️'; binIconEl.style.filter = ''; }
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (binCount) binCount.textContent = `${recycleBin.length} item${recycleBin.length > 1 ? 's' : ''}`;

  recycleBin.forEach((item, index) => {
    const row = document.createElement('div');
    row.style.cssText = `
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.5rem 0.75rem; background: #ffffff;
      border: 1px solid #d8d8e8; border-radius: 6px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.88rem; color: #1a1a3e;
      cursor: default; transition: background 0.15s;
    `;
    row.innerHTML = `
      <span style="font-size:1.4rem;">${item.iconImg}</span>
      <span style="flex:1;">${item.label}</span>
      <span style="font-size:0.72rem; color:#888899;">Deleted</span>
    `;
    row.addEventListener('mouseenter', () => row.style.background = '#eef2ff');
    row.addEventListener('mouseleave', () => row.style.background = '#ffffff');
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(e.clientX, e.clientY, [
        { label: '♻️ Restore', action: () => restoreFromBin(index) },
        { label: 'separator' },
        { label: '❌ Delete Permanently', action: () => {
          recycleBin.splice(index, 1);
          updateRecycleBinWindow();
        }},
      ]);
    });
    itemsEl.appendChild(row);
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
  updateRecycleBinWindow();
}

function emptyRecycleBin() {
  if (recycleBin.length === 0) return;
  if (confirm('Permanently delete all items in the Recycle Bin?')) {
    recycleBin.length = 0;
    updateRecycleBinWindow();
  }
}

// ========== DRAGGABLE ICONS ==========
function makeIconDraggable(icon) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = icon.offsetLeft;
    startTop = icon.offsetTop;
    icon.style.zIndex = 500;
    icon.dataset.dragging = 'true';
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    icon.style.left = `${startLeft + dx}px`;
    icon.style.top = `${startTop + dy}px`;

    // Highlight bin if hovering over it while dragging
    const binIcon = document.getElementById('recycle-bin');
    if (binIcon && icon !== binIcon) {
      const binRect = binIcon.getBoundingClientRect();
      const overBin =
        e.clientX >= binRect.left && e.clientX <= binRect.right &&
        e.clientY >= binRect.top  && e.clientY <= binRect.bottom;
      if (overBin) {
        binIcon.style.background = 'rgba(200,0,0,0.25)';
        binIcon.style.borderColor = 'rgba(200,0,0,0.6)';
      } else {
        binIcon.style.background = '';
        binIcon.style.borderColor = '';
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    icon.style.zIndex = '';
    icon.dataset.dragging = 'false';

    // Check if dropped on bin
    const binIcon = document.getElementById('recycle-bin');
    if (binIcon && icon !== binIcon) {
      const binRect = binIcon.getBoundingClientRect();
      const overBin =
        e.clientX >= binRect.left && e.clientX <= binRect.right &&
        e.clientY >= binRect.top  && e.clientY <= binRect.bottom;
      if (overBin) {
        binIcon.style.background = '';
        binIcon.style.borderColor = '';
        sendToRecycleBin(icon);
      }
    }
  });
}

// ========== ICON CLICK ==========
function initIcons() {
  const icons = document.querySelectorAll('.icon');
  const startX = 20, startY = 20, spacingY = 160;

  icons.forEach((icon, i) => {
    icon.style.position = 'absolute';
    icon.style.left = `${startX}px`;
    icon.style.top = `${startY + i * spacingY}px`;
    makeIconDraggable(icon);

    let clickCount = 0;
    let clickTimer = null;
    let moved = false;

    icon.addEventListener('mousedown', () => { moved = false; });
    icon.addEventListener('mousemove', () => { moved = true; });

    icon.addEventListener('click', (e) => {
      if (moved) return;
      e.stopPropagation();
      clickCount++;
      icon.classList.add('selected');
      if (clickCount === 1) {
        clickTimer = setTimeout(() => { clickCount = 0; }, 400);
      } else if (clickCount >= 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        openWindow(icon.dataset.window);
      }
    });
  });

  document.getElementById('desktop').addEventListener('click', (e) => {
    if (!e.target.closest('.icon')) {
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    }
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
        win.style.maxWidth = '';
        win.style.borderRadius = '';
        if (body) body.style.maxHeight = '620px';
        win.dataset.maximized = 'false';
      } else {
        win.dataset.prevWidth = win.style.width || '820px';
        win.dataset.prevHeight = win.style.height || '';
        win.dataset.prevTop = win.style.top || '80px';
        win.dataset.prevLeft = win.style.left || '160px';
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 42px)';
        win.style.maxWidth = '100vw';
        win.style.borderRadius = '0';
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
    let dragging = false;
    let startX, startY, startLeft, startTop;

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('win-btn')) return;
      if (win.dataset.maximized === 'true') return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(win.style.left) || win.offsetLeft;
      startTop = parseInt(win.style.top) || win.offsetTop;
      bringToFront(win);
      e.preventDefault();
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
  position: fixed;
  background: #f0f0f4;
  border-top: 2px solid #5a5a8a;
  border-left: 2px solid #5a5a8a;
  border-right: 2px solid #1a1a35;
  border-bottom: 2px solid #1a1a35;
  min-width: 190px;
  z-index: 99000;
  display: none;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.4);
  font-family: 'Share Tech Mono', monospace;
`;

const desktopMenuItems = [
  { label: '🔄 Refresh Desktop', action: () => location.reload() },
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
      contextMenu.appendChild(sep);
      return;
    }
    const el = document.createElement('div');
    el.textContent = item.label;
    el.style.cssText = `
      padding: 0.35rem 1.1rem;
      font-size: 0.8rem;
      color: #1a1a3e;
      cursor: pointer;
      white-space: nowrap;
    `;
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
        { label: '🗑️ Open Recycle Bin', action: () => openWindow('recyclebin') },
        { label: 'separator' },
        { label: '💥 Empty Recycle Bin', action: () => emptyRecycleBin() },
      ]);
      return;
    }
    showContextMenu(e.clientX, e.clientY, [
      { label: `📂 Open ${windowTitles[id]}`, action: () => openWindow(id) },
      { label: 'separator' },
      { label: '✏️ Rename', action: () => renameIcon(icon) },
      { label: '🗑️ Send to Recycle Bin', action: () => sendToRecycleBin(icon) },
    ]);
    return;
  }
  showContextMenu(e.clientX, e.clientY, desktopMenuItems);
});

document.addEventListener('click', hideContextMenu);

function arrangeIcons() {
  const icons = document.querySelectorAll('.icon');
  const startX = 20, startY = 20, spacingY = 160;
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
  input.style.cssText = `
    width: 100px; font-size: 0.8rem;
    font-family: 'Share Tech Mono', monospace;
    text-align: center; border: 1px solid #000080;
    background: white; color: black; padding: 2px 4px;
  `;
  label.innerHTML = '';
  label.appendChild(input);
  input.focus();
  input.select();
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
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
      startMenu.classList.add('hidden');
    }
  });
  document.querySelectorAll('.start-item').forEach(item => {
    item.addEventListener('click', () => {
      openWindow(item.dataset.window);
      startMenu.classList.add('hidden');
    });
  });
}

// ========== SYSTEM MONITOR ==========
const sysState = {
  cpu: 3, ram: 8, pwr: 100,
  uptimeSeconds: 0, activitySpike: 0,
};

let lastMouseX = 0, lastMouseY = 0, mouseVelocity = 0;
document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  mouseVelocity = Math.sqrt(dx * dx + dy * dy);
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

function updateSysMonitor() {
  const openCount = Object.keys(openWindows).filter(k => openWindows[k] !== 'minimized').length;
  const baseCpu = 3 + openCount * 3;
  const mouseCpu = Math.min(75, mouseVelocity * 3.5);
  const noise = Math.random() * 12 - 6;
  const targetCpu = Math.min(99, baseCpu + mouseCpu + sysState.activitySpike + noise);
  sysState.cpu += (targetCpu - sysState.cpu) * 0.45;
  sysState.activitySpike *= 0.78;
  mouseVelocity *= 0.4;

  const targetRam = Math.min(97, 10 + openCount * 12 + Math.random() * 5 - 2);
  sysState.ram += (targetRam - sysState.ram) * 0.3;

  const drainRate = 0.004 + openCount * 0.001 + (sysState.cpu / 100) * 0.008;
  sysState.pwr = Math.max(0, sysState.pwr - drainRate);

  const pwrBar = document.getElementById('pwr-bar');
  if (pwrBar) {
    if (sysState.pwr < 20) {
      pwrBar.style.background = 'linear-gradient(90deg, #aa0000, #ff4444)';
      pwrBar.style.boxShadow = '0 0 6px rgba(255,50,50,0.7)';
    } else if (sysState.pwr < 50) {
      pwrBar.style.background = 'linear-gradient(90deg, #aa6600, #ffaa00)';
      pwrBar.style.boxShadow = '0 0 6px rgba(255,170,0,0.5)';
    } else {
      pwrBar.style.background = 'linear-gradient(90deg, #00aa44, #00ff66)';
      pwrBar.style.boxShadow = '0 0 6px rgba(0,255,100,0.4)';
    }
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
  if (cpuVal) {
    cpuVal.textContent = cpuPct + '%';
    cpuVal.style.color = cpuPct > 70 ? '#ff4444' : cpuPct > 40 ? '#ffaa00' : '#1084d0';
  }
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

  initStarfield();
  initIcons();
  initWindowControls();
  initWindowDrag();
  initStartMenu();

  document.querySelectorAll('.window').forEach(win => makeResizable(win));
}

init();