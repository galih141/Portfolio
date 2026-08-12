// Galih Aji Arganata — portwebsite
// Loads projects.json, renders a filterable bento grid, and drives the lightbox.

(() => {
  const catLabels = { visualization: '3D Visualization', mockup: 'Mockup', element: '3D Element' };

  const grid = document.getElementById('projectGrid');
  const emptyState = document.getElementById('emptyState');
  const filterRow = document.getElementById('filterRow');
  const lightbox = document.getElementById('lightbox');
  const lightboxPanel = document.getElementById('lightboxPanel');
  const lightboxContent = document.getElementById('lightboxContent');
  const lbClose = document.getElementById('lightboxClose');

  let projects = [];
  let activeCategory = 'all';

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

      const num = document.createElement('div');
      num.className = 'project-card__num';
      const fixedIndex = projects.indexOf(proj);
      num.textContent = String(fixedIndex + 1).padStart(2, '0');
      body.appendChild(num);

      const title = document.createElement('div');
      title.className = 'project-card__title';
      title.textContent = proj.title;
      body.appendChild(title);

      const cat = document.createElement('div');
      cat.className = 'project-card__cat';
      cat.textContent = (catLabels[proj.category] || proj.category || '').toUpperCase();
      body.appendChild(cat);

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

  // ---------- lightbox (case-study layout) ----------
  function imgWithFallback(src, alt, cssClass, fallbackClass, fallbackText) {
    const img = document.createElement('img');
    img.className = cssClass;
    img.loading = 'lazy';
    img.alt = alt;
    img.src = src;
    img.addEventListener('error', () => {
      const fb = document.createElement('div');
      fb.className = fallbackClass;
      fb.textContent = fallbackText;
      img.replaceWith(fb);
    });
    return img;
  }

  function openLightbox(proj) {
    lightboxContent.innerHTML = '';

    // cover
    const images = proj.images || [];
    if (images.length) {
      lightboxContent.appendChild(
        imgWithFallback(images[0], proj.title, 'cs-cover', 'cs-cover-fallback', 'IMAGE COMING SOON')
      );
    } else {
      const fb = document.createElement('div');
      fb.className = 'cs-cover-fallback';
      fb.textContent = 'IMAGE COMING SOON';
      lightboxContent.appendChild(fb);
    }

    // header: title + meta line (category · client · year)
    const header = document.createElement('div');
    header.className = 'cs-header';

    const h2 = document.createElement('h2');
    h2.textContent = proj.title;
    header.appendChild(h2);

    const meta = document.createElement('div');
    meta.className = 'cs-meta';
    const metaParts = [];
    metaParts.push((catLabels[proj.category] || proj.category || '').toUpperCase());
    if (proj.client) metaParts.push(`CLIENT: ${proj.client.toUpperCase()}`);
    if (proj.year) metaParts.push(`YEAR: ${proj.year}`);
    meta.textContent = metaParts.join('   ·   ');
    header.appendChild(meta);

    lightboxContent.appendChild(header);

    // overview (reuses existing description field)
    if (proj.description) {
      const overview = document.createElement('div');
      overview.className = 'cs-block cs-block--text';
      const h3 = document.createElement('h3');
      h3.textContent = 'Overview';
      const p = document.createElement('p');
      p.textContent = proj.description;
      overview.appendChild(h3);
      overview.appendChild(p);
      lightboxContent.appendChild(overview);
    }

    // optional process blocks (image/text, in order)
    if (Array.isArray(proj.process) && proj.process.length) {
      proj.process.forEach(block => {
        const divider = document.createElement('hr');
        divider.className = 'cs-divider';
        lightboxContent.appendChild(divider);

        if (block.type === 'image' && block.src) {
          const wrap = document.createElement('div');
          wrap.className = 'cs-block';
          wrap.appendChild(
            imgWithFallback(block.src, block.caption || proj.title, 'cs-img', 'cs-img-fallback', 'IMAGE COMING SOON')
          );
          lightboxContent.appendChild(wrap);
        } else if (block.type === 'text') {
          const wrap = document.createElement('div');
          wrap.className = 'cs-block cs-block--text';
          if (block.heading) {
            const h3 = document.createElement('h3');
            h3.textContent = block.heading;
            wrap.appendChild(h3);
          }
          const p = document.createElement('p');
          p.textContent = block.body || '';
          wrap.appendChild(p);
          lightboxContent.appendChild(wrap);
        }
      });
    }

    // remaining images as a final gallery grid
    const rest = images.slice(1);
    if (rest.length) {
      const divider = document.createElement('hr');
      divider.className = 'cs-divider';
      lightboxContent.appendChild(divider);

      const label = document.createElement('div');
      label.className = 'cs-gallery-label';
      label.textContent = 'More from this project';
      lightboxContent.appendChild(label);

      const gallery = document.createElement('div');
      gallery.className = 'cs-gallery';
      rest.forEach((src, i) => {
        gallery.appendChild(
          imgWithFallback(src, `${proj.title} — image ${i + 2}`, '', 'cs-img-fallback', 'IMAGE COMING SOON')
        );
      });
      lightboxContent.appendChild(gallery);
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxPanel.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('open') && e.key === 'Escape') closeLightbox();
  });

  // ---------- theme toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function updateToggleLabel() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
  updateToggleLabel();

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleLabel();
  });

  // ---------- back to top ----------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
