document.addEventListener("DOMContentLoaded", () => {
  // HERO SLIDER WITH ARROW NAVIGATION & AUTO SLIDE

  const slider = document.getElementById("hero-slider");
  const slides = document.querySelectorAll("#hero-slider .slide");
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;
  let autoSlideInterval;

  // Clone first slide and append for seamless looping
  const firstClone = slides[0].cloneNode(true);
  slider.appendChild(firstClone);

  function goToSlide(slideIdx) {
    slider.style.transition = "transform 1s cubic-bezier(0.7,0,0.3,1)";
    slider.style.transform = `translateX(-${slideIdx * 100}vw)`;
  }

  function jumpToSlide(slideIdx) {
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${slideIdx * 100}vw)`;
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide++;
    goToSlide(currentSlide);

    if (currentSlide === totalSlides) {
      setTimeout(() => {
        jumpToSlide(0);
        currentSlide = 0;
        isTransitioning = false;
      }, 1000);
    } else {
      setTimeout(() => { isTransitioning = false; }, 1000);
    }
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    if (currentSlide === 0) {
      jumpToSlide(totalSlides);
      currentSlide = totalSlides;
      setTimeout(() => {
        goToSlide(currentSlide - 1);
        currentSlide = currentSlide - 1;
        setTimeout(() => { isTransitioning = false; }, 1000);
      }, 20);
    } else {
      currentSlide--;
      goToSlide(currentSlide);
      setTimeout(() => { isTransitioning = false; }, 1000);
    }
  }

  autoSlideInterval = setInterval(nextSlide, 5000);

  document.getElementById("slider-right").addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    nextSlide();
    autoSlideInterval = setInterval(nextSlide, 5000);
  });

  document.getElementById("slider-left").addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    prevSlide();
    autoSlideInterval = setInterval(nextSlide, 5000);
  });

  // SMOOTH SCROLLING FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  // ADD TO CART ANIMATION
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      if (productCard) {
        productCard.classList.add('animate-pulse');
        setTimeout(() => {
          productCard.classList.remove('animate-pulse');
        }, 500);
      }
    });
  });
});