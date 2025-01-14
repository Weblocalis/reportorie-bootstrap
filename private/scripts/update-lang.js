'use strict';

const fs = require('fs');
const path = require('path');

// Fonction pour lire et traiter tous les fichiers HTML d'un dossier récursivement
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
                    // Si c'est un fichier HTML, on le traite
                    updateLangAttribute(filePath);
                }
            });
        });
    });
}

// Fonction pour modifier l'attribut lang de "en" à "fr"
function updateLangAttribute(filePath) {
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}: ${err.message}`);
            return;
        }

        // Remplacer lang="en" par lang="fr"
        const updatedContent = content.replace(/<html lang="en"/g, '<html lang="fr"');

        // Écrire le fichier mis à jour
        fs.writeFile(filePath, updatedContent, 'utf-8', err => {
            if (err) {
                console.error(`Erreur lors de l'écriture dans le fichier ${filePath}: ${err.message}`);
            } else {
                console.log(`Attribut lang modifié dans : ${filePath}`);
            }
        });
    });
}

// Spécifiez le chemin du dossier contenant les templates
const templatesDir = path.resolve(__dirname, '../../public/templates');

// Lancer le traitement
processFiles(templatesDir);