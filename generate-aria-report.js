const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// Initialiser la variable report en tant que tableau vide
let report = [];

// Fonction pour échapper les caractères HTML spéciaux
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Fonction pour analyser un fichier HTML et signaler les éléments
function analyzeElements(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);
  let localReport = [];
  
  
  $('button').each(function() {
    const element = $(this);
    const tagName = element.prop('tagName').toLowerCase(); // Récupère le nom de l'élément, comme 'button', 'a', etc.
    
    // Initialiser les valeurs pour chaque élément
    let missingAttribute = '';
    let proposedSolution = '';
    let context = '';

    // Vérifier pour les éléments avec ARIA
    if (tagName === 'button' && !element.attr('aria-label') && !element.text()) {
      missingAttribute = 'aria-label';
      proposedSolution = 'Ajouter un attribut aria-label.';
      context = 'Les boutons doivent avoir un aria-label ou un texte visible pour les lecteurs d\'écran.';
    } else if (tagName === 'a' && !element.attr('aria-label') && !element.text()) {
      missingAttribute = 'aria-label';
      proposedSolution = 'Ajouter un attribut aria-label pour décrire la destination du lien.';
      context = 'Les liens sans texte visible nécessitent un aria-label pour que les technologies d\'assistance comprennent leur fonction.';
    } else if (tagName === 'img' && !element.attr('alt')) {
      missingAttribute = 'alt';
      proposedSolution = 'Ajouter un attribut alt décrivant l\'image.';
      context = 'Les images doivent avoir un attribut alt pour être comprises par les utilisateurs de lecteurs d\'écran.';
    } else if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      if (!element.attr('aria-label') && !element.attr('aria-describedby')) {
        missingAttribute = 'aria-label ou aria-describedby';
        proposedSolution = 'Ajouter un attribut aria-label ou aria-describedby.';
        context = 'Les champs de formulaire doivent être étiquetés correctement pour être accessibles via des technologies d\'assistance.';
      }
    }
    
    // Ajouter le rapport pour chaque élément, avec ou sans attribut ARIA
    localReport.push({
      file: filePath,
      element: escapeHtml(element.prop('outerHTML')),
      elementType: tagName,
      missingAttribute: missingAttribute || 'Aucun',
      proposedSolution: proposedSolution || 'Aucun',
      context: context || 'Aucun'
    });
  });

  return localReport;
}

// Parcourir les fichiers HTML dans le répertoire du projet
function processFiles(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);

    if (file.endsWith('.html')) {
      const localReport = analyzeElements(filePath);
      report = report.concat(localReport);  // Ajouter les résultats au tableau global
    } else if (fs.statSync(filePath).isDirectory()) {
      processFiles(filePath);
    }
  });
}

// Exécuter la fonction sur le répertoire du projet
const projectDir = '/storage/emulated/0/Download/Projetsweb/bootstrap-5.3.3-examples/navbars';  // Remplacez par le chemin de votre projet
processFiles(projectDir);

// Générer le rapport HTML avec Bootstrap
let htmlReport = `
  <!doctype html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport ARIA - Accessibilité</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container mt-5">
        <h1 class="display-4">Rapport ARIA - Accessibilité</h1>
        <p>Le rapport suivant contient les éléments et leurs attributs ARIA.</p>
        
         <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Fichier</th>
                <th scope="col">Élément</th>
                <th scope="col">Type d'élément</th>
                <th scope="col">Attribut manquant</th>
                <th scope="col">Message</th>
                <th scope="col">Solution proposée</th>
                <th scope="col">Contexte</th>
              </tr>
            </thead>
            <tbody>
`;

if (report.length > 0) {
  report.forEach(entry => {
    const filePath = path.relative(__dirname, entry.file);
    
    htmlReport += `
      <tr>
        <td><a href="file://${entry.file}" target="_blank">${filePath}</a></td>
        <td><pre>${entry.element}</pre></td>
        <td>${entry.elementType}</td>
        <td>${entry.missingAttribute}</td>
        <td>${entry.message || 'Aucun problème trouvé'}</td>
        <td>${entry.proposedSolution}</td>
        <td>${entry.context}</td>
      </tr>
    `;
  });
} else {
  htmlReport += `
    <tr>
      <td colspan="7">Aucun problème d'accessibilité ARIA trouvé.</td>
    </tr>
  `;
}

htmlReport += `
          </tbody>
        </table>
      </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
`;

// Sauvegarder le rapport HTML
fs.writeFileSync('aria-report-bootstrap.html', htmlReport);

console.log('Rapport ARIA généré en format HTML avec Bootstrap : aria-report-bootstrap.html');