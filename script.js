document.addEventListener('DOMContentLoaded', () => {
  const mainCanvas = document.querySelector('.MainCanvas1');
  if (!mainCanvas) return;

  // --- Background Layers ---
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
  const outlineBox = document.querySelector('.OutlineBox');

  const showPage = (pageId) => {
    const target = document.getElementById(`page-${pageId}`);
    if (!target) return;

    pages.forEach(p => {
      if (p === target) {
        p.style.display = '';
        const iframe = p.querySelector('iframe');
        if (iframe) {
          const targetSrc = iframe.getAttribute('data-src');
          if (targetSrc && !iframe.hasAttribute('src')) {
            iframe.setAttribute('src', targetSrc);
          }
        }
      } else {
        const iframe = p.querySelector('iframe');
        if (iframe && iframe.hasAttribute('src')) {
          const cleanClone = iframe.cloneNode(true);
          cleanClone.removeAttribute('src');
          iframe.parentNode.replaceChild(cleanClone, iframe);
        }
        p.style.display = 'none';
      }
    });

    layers.forEach(l => l.classList.remove('active'));
  };

  // --- Event Listeners ---
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (outlineBox) {
        outlineBox.classList.remove('navbar-hidden');
      }
      showPage(btn.dataset.page);
    });
  });

  const fullscreenBtn = document.querySelector('.CanvasFullscreenBTN');
  if (fullscreenBtn && outlineBox) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      outlineBox.classList.add('navbar-hidden');
    });
  }

  // --- Double-Tap To Exit Fullscreen ---
  let tapCount = 0;
  let lastTapTime = 0;

  if (outlineBox) {
    outlineBox.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return;
      if (!outlineBox.classList.contains('navbar-hidden')) return;

      const currentTime = new Date().getTime();
      const tapTimeout = 350;

      if (currentTime - lastTapTime > tapTimeout) {
        tapCount = 1;
      } else {
        tapCount++;
      }

      lastTapTime = currentTime;

      if (tapCount === 2) {
        outlineBox.classList.remove('navbar-hidden');
        tapCount = 0; 
      }
    });
  }

  // --- Initial State ---
  const visiblePage = pages.find(p => p.style.display !== 'none');
  if (!visiblePage && navBtns.length > 0) {
    showPage(navBtns[0].dataset.page);
  } else if (visiblePage) {
    const initialIframe = visiblePage.querySelector('iframe');
    if (initialIframe) {
      const initialSrc = initialIframe.getAttribute('data-src');
      if (initialSrc && !initialIframe.hasAttribute('src')) {
        initialIframe.setAttribute('src', initialSrc);
      }
    }
  }
});