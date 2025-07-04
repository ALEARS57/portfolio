window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburgerMenu');
  const mobileNavOverlay = document.getElementById('mobileNav');
  const closeNav = document.getElementById('closeNav');

  if (hamburger && mobileNavOverlay && closeNav) {
    hamburger.addEventListener('click', () => {
      mobileNavOverlay.classList.add('active');
    });

    closeNav.addEventListener('click', () => {
      mobileNavOverlay.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      const sidebar = mobileNavOverlay.querySelector('.mobile-nav');
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNavOverlay.classList.remove('active');
      }
    });
  }
});
