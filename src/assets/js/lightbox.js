const photos = window.GALLERY_PHOTOS || [];
let currentPhoto = 0;

function setPhoto(index) {
  const img = document.getElementById('lightbox-img');
  img.src = '/img/' + photos[index].src;
  img.alt = photos[index].alt || '';
}

function openLightbox(index) {
  currentPhoto = index;
  setPhoto(index);
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
  setPhoto(currentPhoto);
}

function nextPhoto() {
  currentPhoto = (currentPhoto + 1) % photos.length;
  setPhoto(currentPhoto);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox({ target: document.getElementById('lightbox') });
  if (e.key === 'ArrowLeft') prevPhoto();
  if (e.key === 'ArrowRight') nextPhoto();
});
