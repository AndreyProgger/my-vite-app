import './style.css'

// Навигация между страницами
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a')
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const page = link.getAttribute('data-page')
      
      // Для GitHub Pages используем полные пути
      if (window.location.hostname.includes('github.io')) {
        const repoName = 'my-vite-app' 
        window.location.href = `/${repoName}/${page}/${page}.html`
      } else {
        // Для локальной разработки
        window.location.href = `/src/pages/${page}/${page}.html`
      }
    })
  })
})
