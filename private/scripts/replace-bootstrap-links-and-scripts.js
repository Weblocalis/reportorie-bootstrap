'use strict';

const fs = require('fs');
const path = require('path');

// Fonction pour rechercher et remplacer les balises <link> et <script>
function replaceBootstrapLinksAndScripts(filePath) {
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}: ${err.message}`);
            return;
        }

        // Remplacement des balises <link> pour bootstrap.min.css
        let updatedContent = content.replace(
            /<link href=".*?bootstrap\.min\.css" rel="stylesheet">/g,
            `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">`
        );

        // Remplacement des balises <script> pour bootstrap.bundle.min.js
        updatedContent = updatedContent.replace(
            /<script src=".*?bootstrap\.bundle\.min\.js"><\/script>/g,
            `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" defer></script>`
        );

        // Vérifier si des remplacements ont été effectués
        if (content !== updatedContent) {
            // Écriture des modifications dans le fichier
            fs.writeFile(filePath, updatedContent, 'utf-8', err => {
                if (err) {
                    console.error(`Erreur lors de l'écriture dans le fichier ${filePath}: ${err.message}`);
                } else {
                    console.log(`Balises remplacées dans : ${filePath}`);
                }
            });
        }
    });
}

// Fonction pour parcourir les fichiers HTML d'un dossier récursivement
function processFiles(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Erreur lors de la lecture du dossier ${directory}: ${err.message}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Erreur lors de la vérification du fichier ${filePath}: ${err.message}`);
                    return;
                }

                if (stats.isDirectory()) {
                    // Si c'est un dossier, on le parcourt récursivement
                    processFiles(filePath);
                } else if (stats.isFile() && file.endsWith('.html')) {
                    // Si c'est un fichier HTML, rechercher et remplacer les balises
                    replaceBootstrapLinksAndScripts(filePath);
                }
            });
        });
    });
}

// Spécifiez le chemin du dossier contenant les templates
const templatesDir = path.resolve(__dirname, '../../public/templates');

// Lancer le traitement
processFiles(templatesDir);