document.addEventListener('DOMContentLoaded', () => {
  const mainCanvas = document.querySelector('.MainCanvas1');
  if (!mainCanvas) return;

  // --- Setup Background Layers ---
  const layers = [createLayer(), createLayer()];
  
  function createLayer() {
    const layer = document.createElement('div');
    layer.className = 'MainCanvasBG';
    mainCanvas.insertBefore(layer, mainCanvas.firstChild);
    return layer;
  }
  // --- Navigation Logic ---
  const pages = Array.from(document.querySelectorAll('.page'));
  const navBtns = document.querySelectorAll('[data-page]');

  const showPage = (pageId) => {
    const target = document.getElementById(`page-${pageId}`);
    if (!target) return;
    pages.forEach(p => p.style.display = p === target ? '' : 'none');
    layers.forEach(l => l.classList.remove('active'));
  };

  // --- Event Listeners ---
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  // --- Initial State ---
  const visiblePage = pages.find(p => p.style.display !== 'none');
  if (!visiblePage && navBtns.length > 0) {
    showPage(navBtns[0].dataset.page);
  }
});