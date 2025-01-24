document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour charger le contenu HTML
  const loadHTML = async (selector, filePath, callback) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement de ${filePath}: ${response.statusText}`);
      }
      const data = await response.text();
      const targetElement = document.querySelector(selector);

      if (!targetElement) {
        console.error(`Élément avec le sélecteur ${selector} introuvable.`);
        return;
      }

      targetElement.innerHTML = data;
      if (callback) callback(); // Exécuter un callback si fourni
    } catch (error) {
      console.error(`Erreur: ${error.message}`);
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        targetElement.innerHTML = `<p style="color: red;">Erreur lors du chargement de ${filePath}.</p>`;
      }
    }
  };

  // Liste des modules à charger
  const modules = [
    { selector: '#hero-module', filePath: 'components/hero-module.html' },
    { selector: '#section-logo-module', filePath: 'components/section-logo-module.html' },
    { selector: '#section-post-module', filePath: 'components/section-post-module.html' },
    { selector: '#form-section-module', filePath: 'components/form-section-module.html' },
    { selector: '#service-section-module', filePath: 'components/service-section-module.html' },
    { selector: '#newsletter-module', filePath: 'components/newsletter-module.html' },
    { selector: '#header-module', filePath: 'components/header-module.html' },
    { selector: '#about-module', filePath: 'components/about-module.html' },
    { selector: '#footer-module', filePath: 'components/footer-module.html' },
    { selector: '#section-team-module', filePath: 'components/section-team-module.html' },
    { selector: '#section-review-module', filePath: 'components/section-review-module.html' },
    { selector: '#section-portfolio-module', filePath: 'components/section-portfolio-module.html' },
    { selector: '#section-faq-module', filePath: 'components/section-faq-module.html' },
    { selector: '#section-pricing-module', filePath: 'components/section-pricing-module.html' },
    { selector: '#section-stats-module', filePath: 'components/section-stats-module.html' },
    { selector: '#section-features-module', filePath: 'components/section-features-module.html' }
  ];

  // Charger les modules
  modules.forEach(module => loadHTML(module.selector, module.filePath));

  // Afficher l'année actuelle
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});