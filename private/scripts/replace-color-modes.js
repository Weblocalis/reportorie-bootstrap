'use strict';

const fs = require('fs');
const path = require('path');

// Fonction pour rechercher et remplacer les balises <script>
function replaceColorModesScript(filePath) {
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}: ${err.message}`);
            return;
        }

        // Remplacer la balise <script> contenant color-modes.js
        const updatedContent = content.replace(
            /<script.*?src=["'].*?color-modes\.js["'].*?>.*?<\/script>/g,
            '<script src="/assets/js/color-modes.js"></script>'
        );

        // Vérifier si des changements ont été effectués
        if (content !== updatedContent) {
            fs.writeFile(filePath, updatedContent, 'utf-8', err => {
                if (err) {
                    console.error(`Erreur lors de l'écriture dans le fichier ${filePath}: ${err.message}`);
                } else {
                    console.log(`Balise <script> remplacée dans : ${filePath}`);
                }
            });
        } else {
            console.log(`Aucun changement nécessaire pour : ${filePath}`);
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
                    // Si c'est un dossier, le parcourir récursivement
                    processFiles(filePath);
                } else if (stats.isFile() && file.endsWith('.html')) {
                    // Si c'est un fichier HTML, remplacer les balises <script>
                    replaceColorModesScript(filePath);
                }
            });
        });
    });
}

// Spécifiez le chemin du dossier contenant les fichiers HTML
const templatesDir = path.resolve(__dirname, '../../public/templates');

// Lancer le traitement
processFiles(templatesDir);