window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  console.log(`Viewport width: ${width}px, height: ${height}px`);
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight * 0.8
};

const canvas = document.querySelector('#backgroundCanvas');
const scene = new THREE.Scene();

const text = "Hi! I'm Aleyna.";
let index = 0;

function type() {
  const typingElement = document.getElementById("typingEffect");

  if (typingElement && index < text.length) {
    typingElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(type, 100);
  }
}



window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("/home/")) {
    const canvas = document.querySelector("#backgroundCanvas");
    if (canvas) {
      canvas.style.height = "100vh";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      window.dispatchEvent(new Event('resize'));
    }
  }


  type();

  const profileImageContainer = document.querySelector('.profile-image-container');
  if (profileImageContainer) {
    const parallaxRate = 0.02;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (event) => {
      const { innerWidth, innerHeight } = window;
      targetX = (event.clientX / innerWidth - 0.5) * parallaxRate * innerWidth;
      targetY = (event.clientY / innerHeight - 0.5) * parallaxRate * innerHeight;
    });

    function animateParallax() {
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;
      profileImageContainer.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }
});





