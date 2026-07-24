// Galih Aji Arganata — portwebsite
// Loads projects.json, renders a filterable bento grid, and drives the lightbox.

(() => {
  const catLabels = { visualization: '3D Visualization', mockup: 'Mockup', element: '3D Element' };

  const grid = document.getElementById('projectGrid');
  const emptyState = document.getElementById('emptyState');
  const filterRow = document.getElementById('filterRow');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCount = document.getElementById('lbCount');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbCat = document.getElementById('lbCat');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lightboxClose');

  let projects = [];
  let activeCategory = 'all';
  let lbProject = null;
  let lbIndex = 0;

  // ---------- fetch data ----------
  fetch('projects.json', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      projects = Array.isArray(data) ? data : [];
      renderGrid();
    })
    .catch(err => {
      console.error('Could not load projects.json:', err);
      projects = [];
      renderGrid();
    });

  // ---------- grid rendering ----------
  function renderGrid() {
    const filtered = activeCategory === 'all'
      ? projects
      : projects.filter(p => p.category === activeCategory);

    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open project: ${proj.title}`);

      const coverSrc = proj.images && proj.images.length ? proj.images[0] : null;

      if (coverSrc) {
        const img = document.createElement('img');
        img.className = 'project-card__cover';
        img.loading = 'lazy';
        img.alt = proj.title || 'Project cover image';
        img.src = coverSrc;
        img.addEventListener('error', () => {
          const fallback = document.createElement('div');
          fallback.className = 'project-card__cover-fallback';
          fallback.textContent = 'IMAGE COMING SOON';
          img.replaceWith(fallback);
        });
        card.appendChild(img);
      } else {
        const fallback = document.createElement('div');
        fallback.className = 'project-card__cover-fallback';
        fallback.textContent = 'IMAGE COMING SOON';
        card.appendChild(fallback);
      }

      const body = document.createElement('div');
      body.className = 'project-card__body';

      const pill = document.createElement('span');
      pill.className = 'cat-pill';
      pill.dataset.cat = proj.category;
      pill.textContent = catLabels[proj.category] || proj.category;
      body.appendChild(pill);

      const title = document.createElement('div');
      title.className = 'project-card__title';
      title.textContent = proj.title;
      body.appendChild(title);

      const count = document.createElement('div');
      count.className = 'project-card__count';
      const n = proj.images ? proj.images.length : 0;
      count.textContent = `${n} image${n === 1 ? '' : 's'}`;
      body.appendChild(count);

      card.appendChild(body);

      const open = () => openLightbox(proj);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });

      grid.appendChild(card);
    });
  }

  // ---------- filter tabs ----------
  filterRow.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderGrid();
  });

  // ---------- lightbox ----------
  function openLightbox(proj) {
    lbProject = proj;
    lbIndex = 0;
    lbTitle.textContent = proj.title;
    lbDesc.textContent = proj.description || '';
    lbCat.textContent = catLabels[proj.category] || proj.category;
    lbCat.dataset.cat = proj.category;
    updateLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxImage() {
    if (!lbProject || !lbProject.images || lbProject.images.length === 0) return;
    lbImg.src = lbProject.images[lbIndex];
    lbImg.alt = `${lbProject.title} — image ${lbIndex + 1}`;
    lbCount.textContent = `${lbIndex + 1} / ${lbProject.images.length}`;
    const multi = lbProject.images.length > 1;
    lbPrev.style.display = multi ? 'block' : 'none';
    lbNext.style.display = multi ? 'block' : 'none';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbProject = null;
  }

  lbPrev.addEventListener('click', () => {
    if (!lbProject) return;
    lbIndex = (lbIndex - 1 + lbProject.images.length) % lbProject.images.length;
    updateLightboxImage();
  });
  lbNext.addEventListener('click', () => {
    if (!lbProject) return;
    lbIndex = (lbIndex + 1) % lbProject.images.length;
    updateLightboxImage();
  });
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });
})();
