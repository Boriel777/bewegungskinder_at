document.addEventListener('DOMContentLoaded', () => {

  const lightbox = document.createElement('div');
  lightbox.id = 'custom-lightbox';
  lightbox.style.cssText = `
    position: fixed;
    top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.8);
    display:none; justify-content:center; align-items:center;
    z-index:9999; cursor:pointer;
  `;
  const img = document.createElement('img');
  img.style.maxWidth = '90%';
  img.style.maxHeight = '90%';
  img.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
  lightbox.appendChild(img);
  document.body.appendChild(lightbox);

  // Only target links inside WordPress image blocks
  document.body.addEventListener('click', e => {
    const link = e.target.closest('.wp-block-image a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href.match(/\/wp-content\/uploads\/.*\.(jpe?g|png|gif|webp)$/i)) {
      e.preventDefault();
      img.src = href;
      lightbox.style.display = 'flex';
    }
  });

  // Close on click
  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    img.src = '';
  });

});
