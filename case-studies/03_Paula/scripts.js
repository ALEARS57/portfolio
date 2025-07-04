window.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".progress-nav a:not(.scroll-to-top)");
  const scrollTopBtn = document.querySelector(".scroll-to-top");

  // Highlight current section in nav
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  });


  function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');

    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const totalScrollable = scrollHeight - clientHeight;

    let progress = (scrollTop / totalScrollable) * 100;
    progress = Math.max(0, Math.min(progress, 100)); // Clamp 0–100

    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('resize', updateProgressBar);
  window.addEventListener('DOMContentLoaded', updateProgressBar);

  // Scroll to top
  scrollTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Fancybox
  Fancybox.bind('[data-fancybox="case-study-gallery"]', {
    Thumbs: false,
    Toolbar: false,
    closeButton: "top",
  });


});
