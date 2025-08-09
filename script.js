// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Global state
let isPlaying = false;
let currentAudio = null;

// Loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
}

// Progress Bar
function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Header scroll effect
function headerScrollEffect() {
  const header = document.getElementById("header");
  if (!header) return;
  
  const scrolled = window.pageYOffset;
  if (scrolled > 50) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(20px)";
    header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.8)";
    header.style.backdropFilter = "blur(20px)";
    header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.05)";
  }
}

// Mobile menu
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navClose = document.getElementById('navClose');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function openMenu() {
    menuToggle.classList.add('active');
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  // Close menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Smooth scrolling
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const headerHeight = document.getElementById("header")?.offsetHeight || 80;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

// Back to top button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  function toggleBackToTop() {
    const scrolled = window.pageYOffset;
    if (scrolled > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', throttle(toggleBackToTop, 100));
  toggleBackToTop(); // Initial check
}

// AOS-like animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });
}

// Gallery lightbox
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImage || !lightboxClose) return;

  function openLightbox(imageSrc, imageAlt) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add click events to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });

    // Add keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src, img.alt);
        }
      }
    });

    // Make gallery items focusable
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Abrir imagem em tela cheia');
  });

  // Close lightbox events
  lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Audio player
function initAudioPlayer() {
  const audio = document.getElementById('backgroundMusic');
  const playBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const playIcon = playBtn?.querySelector('.play-icon');
  const playText = playBtn?.querySelector('.play-text');

  if (!audio || !playBtn || !volumeSlider) return;

  currentAudio = audio;

  // Set initial volume
  audio.volume = volumeSlider.value;

  function updatePlayButton() {
    if (isPlaying) {
      playIcon.textContent = '⏸️';
      playText.textContent = 'Pause';
      playBtn.classList.add('playing');
    } else {
      playIcon.textContent = '▶️';
      playText.textContent = 'Play';
      playBtn.classList.remove('playing');
    }
  }

  playBtn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        isPlaying = true;
      } else {
        audio.pause();
        isPlaying = false;
      }
      updatePlayButton();
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      playIcon.textContent = '❌';
      playText.textContent = 'Erro';
    }
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });

  // Audio event listeners
  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButton();
  });

  audio.addEventListener('error', () => {
    playIcon.textContent = '❌';
    playText.textContent = 'Erro';
    playBtn.disabled = true;
  });

  // Initial state
  updatePlayButton();
}

// Parallax effect for decorations
function initParallax() {
  const decorations = document.querySelectorAll('.hero-decoration');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    decorations.forEach((decoration, index) => {
      const speed = 0.3 + (index * 0.1);
      decoration.style.transform = `translateY(${rate * speed}px)`;
    });
  }

  // Only apply parallax on larger screens and if user hasn't requested reduced motion
  const mediaQuery = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  
  if (mediaQuery.matches) {
    window.addEventListener('scroll', throttle(updateParallax, 16));
  }
}

// Typing effect for hero text
function initTypingEffect() {
  const heroTitle = document.getElementById('heroTitle');
  const heroText = document.getElementById('heroText');
  
  if (!heroTitle || !heroText) return;

  const titleText = heroTitle.textContent;
  const descText = heroText.textContent;
  
  // Clear text initially
  heroTitle.textContent = '';
  heroText.textContent = '';
  
  function typeText(element, text, speed = 100) {
    return new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  // Start typing animation after loading screen
  setTimeout(async () => {
    await typeText(heroTitle, titleText, 150);
    await typeText(heroText, descText, 50);
  }, 2000);
}

// Performance monitoring
function initPerformanceMonitoring() {
  // Monitor page load performance
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🌊 Site carregado em ${Math.round(loadTime)}ms`);
    
    // Hide loading screen after everything is loaded
    hideLoadingScreen();
  });

  // Monitor memory usage (if available)
  if ('memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        console.warn('Alto uso de memória detectado');
      }
    }, 30000); // Check every 30 seconds
  }
}

// Error handling
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
  });
}

// Accessibility improvements
function initAccessibility() {
  // Add focus indicators for interactive elements
  const style = document.createElement('style');
  style.textContent = `
    .gallery-item:focus,
    .card:focus,
    .btn:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

  // Announce page changes to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);

}

// Initialize everything
function init() {
  // Core functionality
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initScrollAnimations();
  initGallery();
  initAudioPlayer();
  initParallax();
  initTypingEffect();
  
  // Performance and accessibility
  initPerformanceMonitoring();
  initErrorHandling();
  initAccessibility();
  
  // Initial calls
  updateProgressBar();
  headerScrollEffect();
}

// Throttled scroll handler
const handleScroll = throttle(() => {
  updateProgressBar();
  headerScrollEffect();
}, 16); // ~60fps

// Event listeners
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', debounce(() => {
  // Handle resize if needed
}, 250));

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;

// Console message
console.log('🌊 Site do Dia dos Pais carregado com amor! 💙');
console.log('✨ UI moderna e responsiva implementada!');