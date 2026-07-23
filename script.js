// Keep the footer year current without hand-editing HTML.
document.addEventListener('DOMContentLoaded', () => {
  const note = document.querySelector('.footer__note');
  if (note) {
    note.textContent = note.textContent.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
  }
});

/**
 * Swap a placeholder media-slot for a real project image.
 * Call this from the console or wire it up once real photos are ready —
 * or just replace the .media-slot div in index.html directly, either works.
 *
 * Example:
 *   setProjectImage(1, 'assets/project-01.jpg', 'FMCG bottle render, hero shot');
 */
function setProjectImage(slotNumber, imageSrc, altText = '') {
  const slot = document.querySelector(`[data-project-slot="${slotNumber}"]`);
  if (!slot) return;
  slot.style.background = 'none';
  slot.innerHTML = `<img src="${imageSrc}" alt="${altText}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
}
