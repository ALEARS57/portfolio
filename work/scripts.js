const hamburger = document.getElementById('hamburgerMenu');
const mobileNavOverlay = document.getElementById('mobileNav'); // this is now the overlay
const closeNav = document.getElementById('closeNav');

hamburger.addEventListener('click', () => {
  mobileNavOverlay.classList.add('active');
});

closeNav.addEventListener('click', () => {
  mobileNavOverlay.classList.remove('active');
});

document.addEventListener('click', (e) => {
  const sidebar = mobileNavOverlay.querySelector('.mobile-nav');
  if (
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileNavOverlay.classList.remove('active');
  }
});