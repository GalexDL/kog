const books = [
  {
    title: 'Knights of Glory Official Artworks',
    author: 'Gakken',
    viewer: {
      basePath: 'images/KoGOA',
      pageCount: 152,
      cover: 'images/KoGOA/KoGOA_Cover.webp',
    },
  },
  {
    title: 'Book 2',
    author: '???',
    viewer: null,
  },
];

const viewerOverlay = document.getElementById('viewerOverlay');
const viewerImage = document.getElementById('viewerImage');
const viewerFrame = document.getElementById('viewerFrame');
const viewerClose = document.getElementById('viewerClose');
const zoomValueLabel = document.getElementById('zoomValue');
const pageLabel = document.getElementById('viewerPageLabel');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const resButtons = Array.from(document.querySelectorAll('.viewer-res-btn'));
const actionButtons = Array.from(document.querySelectorAll('[data-action]'));

const state = {
  bookIndex: 0,
  resolution: 'lowres',
  page: 1,
  pageCount: 1,
  zoom: 1,
  minZoom: 1,
  maxZoom: 5,
  zoomStep: 0.25,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  imageStartX: 0,
  imageStartY: 0,
  initialPinchDistance: 0,
  initialPinchZoom: 1,
};

function getCurrentPageSrc() {
  const book = books[state.bookIndex];
  return `${book.viewer.basePath}/${state.resolution}/${state.page}.webp`;
}

function updatePageLabel() {
  pageLabel.textContent = `Page ${state.page} / ${state.pageCount}`;
}

function updateViewerImage() {
  const book = books[state.bookIndex];
  if (!book || !book.viewer) return;

  viewerImage.src = getCurrentPageSrc();
  document.querySelector('.viewer-title').textContent = book.title;
  state.zoom = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  updateZoomLabel();
  updatePageLabel();
  applyTransform();
}

function updateZoomLabel() {
  zoomValueLabel.textContent = `${Math.round(state.zoom * 100)}%`;
}

function applyTransform() {
  viewerImage.style.transform = `translate(calc(-50% + ${state.offsetX}px), calc(-50% + ${state.offsetY}px)) scale(${state.zoom})`;
}

function openViewer(bookIndex) {
  const book = books[bookIndex];
  if (!book || !book.viewer) {
    alert('There is no viewer available for this book at this time.');
    return;
  }

  state.bookIndex = bookIndex;
  state.resolution = 'lowres';
  state.page = 1;
  state.pageCount = book.viewer.pageCount;
  viewerOverlay.classList.remove('hidden');
  closeSettingsPanel();
  resButtons.forEach((button) => {
    button.classList.toggle(button.dataset.res === state.resolution);
  });
  updateViewerImage();
}

// close Controls
function closeViewer() {
  viewerOverlay.classList.add('hidden');
  resetViewer();
}
// Settings Panel Controls
function closeSettingsPanel() {
  settingsPanel.classList.add('hidden');
}

function toggleSettingsPanel() {
  settingsPanel.classList.toggle('hidden');
}
// resolution controls
function setResolution(resolution) {
  if (resolution !== 'lowres' && resolution !== 'midres') return;
  state.resolution = resolution;
  resButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.res === resolution);
  });
  closeSettingsPanel();
  updateViewerImage();
}

// Page Controls
function setPage(page) {
  const book = books[state.bookIndex];
  if (!book || !book.viewer) return;
  state.page = Math.min(Math.max(1, page), state.pageCount);
  updateViewerImage();
}

function nextPage() {
  if (state.page < state.pageCount) {
    setPage(state.page + 1);
  }
}
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPage();
  }
});

function prevPage() {
  if (state.page > 1) {
    setPage(state.page - 1);
  }
}
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    prevPage();
  }
});

// Zoom Controls
function changeZoom(delta) {
  const nextZoom = Math.min(state.maxZoom, Math.max(state.minZoom, state.zoom + delta));
  if (nextZoom === state.zoom) return;
  state.zoom = nextZoom;
  if (state.zoom === 1) {
    state.offsetX = 0;
    state.offsetY = 0;
  }
  updateZoomLabel();
  applyTransform();
}

// Touch Controls
function getTouchDistance(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

viewerFrame.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    state.dragging = false; // Stop single-finger dragging
    state.initialPinchDistance = getTouchDistance(e.touches);
    state.initialPinchZoom = state.zoom;
  }
}, { passive: true });

viewerFrame.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && state.initialPinchDistance > 0) {
    const currentDistance = getTouchDistance(e.touches);
    const ratio = currentDistance / state.initialPinchDistance;
    
    state.zoom = Math.min(state.maxZoom, Math.max(state.minZoom, state.initialPinchZoom * ratio));
    
    if (state.zoom === 1) {
      state.offsetX = 0;
      state.offsetY = 0;
    }
    updateZoomLabel();
    applyTransform();
  }
}, { passive: true });

viewerFrame.addEventListener('touchend', (e) => {
  if (e.touches.length === 1 && state.zoom > 1) {
    state.dragging = true;
    state.dragStartX = e.touches[0].clientX;
    state.dragStartY = e.touches[0].clientY;
    state.imageStartX = state.offsetX;
    state.imageStartY = state.offsetY;
  } else if (e.touches.length === 0) {
    state.dragging = false;
  }
});

function resetViewer() {
  state.zoom = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  updateZoomLabel();
  applyTransform();
}





//Book Viewer Controls
document.querySelectorAll('.book-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    openViewer(index);
  });
});

viewerClose.addEventListener('click', closeViewer);

viewerOverlay.addEventListener('click', (event) => {
  if (event.target === viewerOverlay) {
    closeViewer();
  }
});

resButtons.forEach((button) => {
  button.addEventListener('click', () => setResolution(button.dataset.res));
});

settingsToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleSettingsPanel();
});

viewerOverlay.addEventListener('click', (event) => {
  if (event.target === settingsPanel || settingsPanel.contains(event.target)) return;
  closeSettingsPanel();
});

actionButtons.forEach((button) => {
  const action = button.dataset.action;
  if (action === 'zoom-in') button.addEventListener('click', () => changeZoom(state.zoomStep));
  if (action === 'zoom-out') button.addEventListener('click', () => changeZoom(-state.zoomStep));
  if (action === 'reset') button.addEventListener('click', resetViewer);
  if (action === 'next-page') button.addEventListener('click', nextPage);
  if (action === 'prev-page') button.addEventListener('click', prevPage);
});

viewerImage.addEventListener('load', () => {
  if (state.zoom === 1) {
    state.offsetX = 0;
    state.offsetY = 0;
    applyTransform();
  }
});

viewerFrame.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -state.zoomStep : state.zoomStep;
  changeZoom(delta);
});

viewerFrame.addEventListener('pointerdown', (event) => {
  if (state.zoom <= 1) return;
  event.preventDefault();
  state.dragging = true;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.imageStartX = state.offsetX;
  state.imageStartY = state.offsetY;
  viewerFrame.setPointerCapture(event.pointerId);
});

viewerFrame.addEventListener('pointermove', (event) => {
  if (!state.dragging) return;
  event.preventDefault();
  const deltaX = event.clientX - state.dragStartX;
  const deltaY = event.clientY - state.dragStartY;
  state.offsetX = state.imageStartX + deltaX;
  state.offsetY = state.imageStartY + deltaY;
  applyTransform();
});

viewerFrame.addEventListener('pointerup', () => {
  state.dragging = false;
});

viewerFrame.addEventListener('pointercancel', () => {
  state.dragging = false;
});

// Table of Contents Controls
async function loadTOC() {
    const response = await fetch('toc.json');
    const data = await response.json();
    const container = document.getElementById('toc-list');

    container.innerHTML = `<ul class="toc-main-list">${data.map(item => {
        const mainPage = item.MainPage || item.Page;
        const subPages = item.SubPage ? item.SubPage.split(/,\s*/) : [];
        const hasSubItems = item.SubHead && item.SubHead.trim() !== "";
        const subItemsHtml = hasSubItems ? item.SubHead.split(/,\s*/).map((head, i) => `
            <li class="toc-sub-item toc-row" data-page="${subPages[i]}">${head}</li>
        `).join('') : '';

        return `
            <li class="toc-main-item">
                <div class="toc-main-title toc-row" data-page="${mainPage}">${item.MainHead}</div>
                ${hasSubItems ? `<ul class="toc-sub-list">${subItemsHtml}</ul>` : ''}
            </li>
        `;
    }).join('')}</ul>`;

    container.addEventListener('click', (e) => {
        const row = e.target.closest('.toc-row');
        if (row) setPage(parseInt(row.dataset.page));
    });
}
document.addEventListener('DOMContentLoaded', loadTOC);

updateZoomLabel();
updatePageLabel();
applyTransform();
