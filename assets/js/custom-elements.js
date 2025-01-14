document.addEventListener('DOMContentLoaded', () => {
  const loadHTML = (selector, filePath, callback) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement de ${filePath}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        document.querySelector(selector).innerHTML = data;
        if (callback) callback(); // Exécuter un callback si fourni
      })
      .catch(error => {
        console.error(`Erreur: ${error.message}`);
        document.querySelector(selector).innerHTML = `<p style="color: red;">Erreur lors du chargement de ${filePath}.</p>`;
      });
  };

  // Charger les composants
  loadHTML('#header-container', 'components/header.html');
  loadHTML('#about-container', 'components/about.html');
  loadHTML('#footer-container', 'components/footer.html', () => {
    // Insérer l'année après le chargement du footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
  });

  // Charger la section newsletter
  loadHTML('#newsletter-container', 'components/newsletter.html');
});