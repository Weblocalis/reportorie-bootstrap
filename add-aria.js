const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// Fonction pour ajouter les attributs ARIA dans un fichier HTML
function addAriaAttributes(filePath) {
  // Lire le contenu du fichier HTML
  const content = fs.readFileSync(filePath, 'utf-8');

  // Charger le contenu HTML avec cheerio
  const $ = cheerio.load(content);

  // Ajouter des attributs ARIA aux éléments, selon les besoins

  // Exemple : Ajouter un aria-label aux boutons sans texte
  $('button').each(function() {
    if (!$(this).attr('aria-label') && !$(this).text()) {
      $(this).attr('aria-label', 'Un bouton sans texte explicite');
    }
  });

  // Exemple : Ajouter aria-hidden à certains éléments
  $('[hidden]').each(function() {
    $(this).attr('aria-hidden', 'true');
  });

  // Exemple : Ajouter aria-live aux zones dynamiques
  $('.dynamic').each(function() {
    $(this).attr('aria-live', 'polite');
  });

  // Sauvegarder le fichier modifié
  fs.writeFileSync(filePath, $.html());
}

// Parcourir tous les fichiers HTML dans le répertoire
function processFiles(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);

    // Si c'est un fichier HTML, on ajoute les attributs ARIA
    if (file.endsWith('.html')) {
      addAriaAttributes(filePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      // Si c'est un dossier, on le parcourt récursivement
      processFiles(filePath);
    }
  });
}

// Exécuter la fonction sur le répertoire du projet
const projectDir = path.join(__dirname, 'bootstrap-5.3.3-examples');  // Chemin de votre projet
processFiles(projectDir);

console.log('Attributs ARIA ajoutés avec succès !');