document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 992px)').matches;

  if (window.AOS) {
    AOS.init({ once: true, offset: 70, duration: 750, easing: 'ease-out-cubic', disable: reducedMotion });
  }

  if (window.Swiper) {
    new Swiper('.collection-swiper', {
      slidesPerView: 1.08,
      spaceBetween: 16,
      grabCursor: true,
      speed: 850,
      keyboard: { enabled: true },
      breakpoints: {
        768: { slidesPerView: 2.15, spaceBetween: 24 },
        1200: { slidesPerView: 3.15, spaceBetween: 24 }
      },
      pagination: { el: '.collection-swiper .swiper-pagination', clickable: true }
    });

    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 900,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      keyboard: { enabled: true },
      autoplay: reducedMotion ? false : { delay: 7000, disableOnInteraction: true, pauseOnMouseEnter: true },
      pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true }
    });
  }

  const revealItems = document.querySelectorAll(
    '.section-heading, .product-card, .collection-card, .craft-image, .testimonial-card, .contact-shell, .statistics .col-6'
  );
  revealItems.forEach((item) => item.classList.add('js-reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
    revealObserver.observe(item);
  });

  if (window.gsap && !reducedMotion) {
    gsap.from('.hero .eyebrow', { y: 18, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' });
    gsap.from('.hero h1', { y: 40, opacity: 0, duration: 1.05, delay: 0.25, ease: 'power3.out' });
    gsap.from('.hero-copy, .hero .d-flex, .trust-line', {
      y: 24,
      opacity: 0,
      duration: 0.85,
      delay: 0.48,
      stagger: 0.12,
      ease: 'power3.out'
    });
    gsap.from('.hero-media', { x: -45, scale: 1.035, opacity: 0, duration: 1.25, delay: 0.2, ease: 'power3.out' });
  }

  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('#backToTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 45);
    backToTop.classList.toggle('show', window.scrollY > 550);
    if (desktop && !reducedMotion) {
      const media = document.querySelector('.hero-parallax');
      if (media) media.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.08, 45)}px, 0)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  if (desktop && !reducedMotion) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (event) => {
      glow.classList.add('visible');
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('visible'));

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
        if (window.gsap) gsap.to(button, { x, y, duration: 0.25, ease: 'power2.out' });
        else button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, .45)' });
        else button.style.transform = '';
      });
    });
  }

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.target);
      if (reducedMotion) {
        element.textContent = target;
      } else {
        let startedAt = null;
        const update = (time) => {
          startedAt ??= time;
          const progress = Math.min((time - startedAt) / 1800, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else element.textContent = target;
        };
        requestAnimationFrame(update);
      }
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.7 });
  counters.forEach((counter) => counterObserver.observe(counter));

  const form = document.querySelector('#consultationForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    if (form.checkValidity()) {
      message.textContent = 'شكرًا لتواصلك. سيعود إليك أحد مستشاري AURELIS MAISON قريبًا.';
      form.reset();
    } else {
      message.textContent = 'يرجى تعبئة الحقول المطلوبة بشكل صحيح.';
    }
    form.classList.add('was-validated');
  });
});
