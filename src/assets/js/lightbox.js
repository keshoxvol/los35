const photos = window.GALLERY_PHOTOS || [];
let currentPhoto = 0;

function openLightbox(index) {
  currentPhoto = index;
  document.getElementById('lightbox-img').src = '/img/' + photos[index];
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (!e || e.target === document.getElementById('lightbox') || e.target.classList.contains('lightbox-close')) {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
}

function prevPhoto() {
  currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  document.getElementById('lightbox-img').src = '/img/' + photos[currentPhoto];
}

function nextPhoto() {
  currentPhoto = (currentPhoto + 1) % photos.length;
  document.getElementById('lightbox-img').src = '/img/' + photos[currentPhoto];
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox({ target: document.getElementById('lightbox') });
  if (e.key === 'ArrowLeft') prevPhoto();
  if (e.key === 'ArrowRight') nextPhoto();
});
