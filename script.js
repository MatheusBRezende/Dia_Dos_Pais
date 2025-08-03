// Progress Bar Animation
function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  document.getElementById("progressBar").style.width = scrolled + "%"
}

// Smooth scroll animation for elements
function animateOnScroll() {
  const elements = document.querySelectorAll(".card, .gallery-item")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }
  })
}

// Initialize animations
function initAnimations() {
  const cards = document.querySelectorAll(".card")
  const galleryItems = document.querySelectorAll(".gallery-item")

  // Set initial state for animation
  ;[...cards, ...galleryItems].forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(30px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  })
}

// Parallax effect for hero decorations
function parallaxEffect() {
  const scrolled = window.pageYOffset
  const decorations = document.querySelectorAll(".hero-decoration")

  decorations.forEach((decoration, index) => {
    const speed = 0.5 + index * 0.1
    decoration.style.transform = `translateY(${scrolled * speed}px)`
  })
}

// Enhanced gallery interactions
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item")

  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.zIndex = "10"
    })

    item.addEventListener("mouseleave", function () {
      this.style.zIndex = "1"
    })

    // Add click event for potential lightbox functionality
    item.addEventListener("click", function () {
      const title = this.querySelector(".photo-title").textContent
      const subtitle = this.querySelector(".photo-subtitle").textContent

      // You can add lightbox functionality here
      console.log(`Clicked on: ${title} - ${subtitle}`)
    })
  })
}

// Smooth scrolling for internal links (if any are added)
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Header background opacity on scroll
function headerScrollEffect() {
  const header = document.getElementById("header")
  const scrolled = window.pageYOffset

  if (scrolled > 100) {
    header.style.background = "linear-gradient(135deg, rgba(46, 139, 192, 0.95), rgba(20, 93, 160, 0.95))"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "linear-gradient(135deg, #2E8BC0, #145DA0)"
    header.style.backdropFilter = "none"
  }
}

// Typing effect for hero text (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initAnimations()
  initGallery()
  smoothScroll()

  // Initial animation check
  setTimeout(animateOnScroll, 100)
})

// Event listeners
window.addEventListener("scroll", () => {
  updateProgressBar()
  animateOnScroll()
  parallaxEffect()
  headerScrollEffect()
})

// Resize handler
window.addEventListener("resize", () => {
  // Recalculate animations if needed
  animateOnScroll()
})

// Add some interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Add hover sound effect (optional)
  const cards = document.querySelectorAll(".card, .gallery-item")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    })
  })

  // Add loading animation
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Console message for developer
console.log("🌊 Site carregado com amor para o melhor pai do mundo! 💙")
