// ===== UTILITY FUNCTIONS =====
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

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// ===== GLOBAL STATE =====
let isPlaying = false;
let currentAudio = null;
let scrollPosition = 0;
let isMenuOpen = false;

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;
  
  // Adiciona efeito de fade out suave
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 600);
    }, 300);
  }, 2000);
}

// ===== PROGRESS BAR =====
function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const progressBar = document.getElementById("progressBar");
  
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
    
    // Adiciona efeito de brilho quando próximo do final
    if (scrolled > 90) {
      progressBar.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.6)';
    } else {
      progressBar.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    }
  }
}

// ===== HEADER EFFECTS =====
function headerScrollEffect() {
  const header = document.getElementById("header");
  if (!header) return;
  
  const scrolled = window.pageYOffset;
  
  if (scrolled > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(20px)";
    header.style.borderBottom = "1px solid rgba(102, 126, 234, 0.2)";
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.9)";
    header.style.backdropFilter = "blur(20px)";
    header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)";
    header.style.boxShadow = "none";
  }
}

// ===== MOBILE MENU =====
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
    isMenuOpen = true;
    
    // Anima os links do menu
    navLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(30px)';
      setTimeout(() => {
        link.style.transition = 'all 0.3s ease';
        link.style.opacity = '1';
        link.style.transform = 'translateX(0)';
      }, index * 100 + 200);
    });
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    isMenuOpen = false;
    
    // Reset dos links
    navLinks.forEach(link => {
      link.style.transition = '';
      link.style.opacity = '';
      link.style.transform = '';
    });
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  // Fecha menu ao clicar nos links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      // Pequeno delay para permitir a animação do menu
      setTimeout(() => {
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
      }, 300);
      e.preventDefault();
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fecha menu com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
}

// ===== SMOOTH SCROLLING =====
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  
  const headerHeight = document.getElementById("header")?.offsetHeight || 80;
  const targetPosition = target.offsetTop - headerHeight;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

function scrollToTop() {
  const duration = 1000;
  const startPosition = window.pageYOffset;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition * (1 - ease));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  function toggleBackToTop() {
    const scrolled = window.pageYOffset;
    if (scrolled > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', throttle(toggleBackToTop, 100));
  toggleBackToTop();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Adiciona delay escalonado para cards
        if (entry.target.classList.contains('card')) {
          const cards = document.querySelectorAll('.card');
          const index = Array.from(cards).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa elementos com animação
  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });
}

// ===== GALLERY LIGHTBOX =====
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Cria lightbox dinamicamente
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      <div class="lightbox-image-container">
        <img id="lightboxImage" src="/placeholder.svg" alt="" />
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);
  
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(imageSrc, imageAlt) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animação de entrada
    lightboxImage.style.transform = 'scale(0.8)';
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
      lightboxImage.style.transition = 'all 0.3s ease';
      lightboxImage.style.transform = 'scale(1)';
      lightboxImage.style.opacity = '1';
    }, 100);
  }

  function closeLightbox() {
    lightboxImage.style.transform = 'scale(0.8)';
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImage.style.transition = '';
    }, 200);
  }

  // Eventos dos itens da galeria
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });

    // Suporte a teclado
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src, img.alt);
        }
      }
    });

    // Torna focável
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Abrir imagem em tela cheia');
  });

  // Eventos do lightbox
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

// ===== AUDIO PLAYER =====
function initAudioPlayer() {
  const audio = document.getElementById('backgroundMusic');
  const playBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const playIcon = playBtn?.querySelector('.play-icon');
  const playText = playBtn?.querySelector('.play-text');

  if (!audio || !playBtn || !volumeSlider) return;

  currentAudio = audio;
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
      playBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    
    // Feedback visual do volume
    const percentage = volumeSlider.value * 100;
    volumeSlider.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  });

  // Eventos do áudio
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
    playBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  });

  // Estado inicial
  updatePlayButton();
  
  // Estilo inicial do slider
  const initialPercentage = volumeSlider.value * 100;
  volumeSlider.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${initialPercentage}%, #e2e8f0 ${initialPercentage}%, #e2e8f0 100%)`;
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
  const decorations = document.querySelectorAll('.hero-decoration');
  const waves = document.querySelectorAll('.wave');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    decorations.forEach((decoration, index) => {
      const speed = 0.2 + (index * 0.1);
      const yPos = rate * speed;
      const rotation = scrolled * 0.1;
      decoration.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
    
    waves.forEach((wave, index) => {
      const speed = 0.1 + (index * 0.05);
      const yPos = rate * speed;
      wave.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Aplica parallax apenas em telas maiores e se o usuário não solicitou movimento reduzido
  const mediaQuery = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  
  if (mediaQuery.matches) {
    window.addEventListener('scroll', throttle(updateParallax, 16));
  }
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
  const heroTitle = document.getElementById('heroTitle');
  const heroText = document.getElementById('heroText');
  
  if (!heroTitle || !heroText) return;

  const titleText = heroTitle.textContent;
  const descText = heroText.textContent;
  
  // Limpa texto inicialmente
  heroTitle.textContent = '';
  heroText.textContent = '';
  heroTitle.style.opacity = '1';
  heroText.style.opacity = '1';
  
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

  // Inicia animação de digitação após tela de carregamento
  setTimeout(async () => {
    await typeText(heroTitle, titleText, 120);
    await new Promise(resolve => setTimeout(resolve, 500));
    await typeText(heroText, descText, 40);
  }, 2500);
}

// ===== CARD HOVER EFFECTS =====
function initCardEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Adiciona efeito de brilho
      card.style.boxShadow = '0 25px 50px -12px rgba(102, 126, 234, 0.25)';
      
      // Anima ícone
      const icon = card.querySelector('.card-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      
      const icon = card.querySelector('.card-icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
  });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
  // Monitora performance de carregamento
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🌊 Site carregado em ${Math.round(loadTime)}ms`);
    
    // Esconde tela de carregamento após tudo carregar
    hideLoadingScreen();
    
    // Inicia animações após carregamento
    setTimeout(() => {
      initScrollAnimations();
      initTypingEffect();
    }, 500);
  });

  // Monitora uso de memória (se disponível)
  if ('memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        console.warn('Alto uso de memória detectado');
      }
    }, 30000);
  }
}

// ===== ERROR HANDLING =====
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
  });
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
  // Adiciona indicadores de foco para elementos interativos
  const style = document.createElement('style');
  style.textContent = `
    .gallery-item:focus,
    .card:focus,
    .btn:focus,
    .nav-link:focus {
      outline: 3px solid #6366f1;
      outline-offset: 2px;
      border-radius: 0.5rem;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .floating-elements,
      .hero-decoration,
      .loading-spinner {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Anuncia mudanças de página para leitores de tela
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.id = 'announcer';
  document.body.appendChild(announcer);

  // Melhora navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Adiciona classe de animação
        entry.target.classList.add('aos-animate');
        
        // Anuncia seção para leitores de tela
        const announcer = document.getElementById('announcer');
        if (announcer && entry.target.id) {
          const sectionName = entry.target.querySelector('h3')?.textContent || 
                             entry.target.querySelector('h2')?.textContent || 
                             'Nova seção';
          announcer.textContent = `Navegou para: ${sectionName}`;
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa seções principais
  document.querySelectorAll('section, .card, .gallery-item').forEach(el => {
    observer.observe(el);
  });
}

// ===== INICIALIZAÇÃO PRINCIPAL =====
function init() {
  console.log('🌊 Inicializando site do Dia dos Pais...');
  
  // Funcionalidades principais
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initGallery();
  initAudioPlayer();
  initParallax();
  initCardEffects();
  initIntersectionObserver();
  
  // Performance e acessibilidade
  initPerformanceMonitoring();
  initErrorHandling();
  initAccessibility();
  
  // Chamadas iniciais
  updateProgressBar();
  headerScrollEffect();
  
  console.log('✨ Site inicializado com sucesso!');
}

// ===== EVENT LISTENERS =====
// Handler de scroll otimizado
const handleScroll = throttle(() => {
  updateProgressBar();
  headerScrollEffect();
  scrollPosition = window.pageYOffset;
}, 16); // ~60fps

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

// Event listeners principais
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', debounce(() => {
  // Reajusta elementos responsivos se necessário
  if (window.innerWidth > 768 && isMenuOpen) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    if (navMenu && menuToggle) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
      isMenuOpen = false;
    }
  }
}, 250));

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
});

// Previne zoom em dispositivos móveis em inputs
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

// ===== FUNÇÕES GLOBAIS =====
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;

// ===== CONSOLE MESSAGES =====
console.log('🌊 Site do Dia dos Pais carregado com amor! 💙');
console.log('✨ UI moderna e responsiva implementada!');
console.log('🎨 Design renovado com gradientes e animações suaves!');
console.log('📱 Totalmente responsivo e acessível!');