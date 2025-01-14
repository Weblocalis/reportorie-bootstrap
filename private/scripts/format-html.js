const fs = require('fs');
const path = require('path');

// Fonction pour nettoyer les séquences incorrectes
function cleanInvalidSequences(html) {
    return html
        // Supprime uniquement les séquences invalides contenant plusieurs < ou >
        .replace(/<{6,}.*?>/g, '') // Séquences comme <<<<<<<<!doctype html>
        .replace(/<\/{6,}.*?>/g, '') // Séquences comme </html>>>>>>>
        // Laisse intactes les balises valides comme <head>, <html>, etc.
        .replace(/<{2,5}.*?>/g, match => {
            // Si une séquence contient moins de 6 caractères "<", on la conserve
            return match;
        })
        .replace(/<\/.*?>{2,5}/g, match => {
            // Si une séquence contient moins de 6 caractères ">", on la conserve
            return match;
        })
        // Supprime les lignes complètement vides
        .replace(/^\s*[\r\n]/gm, '')
        .trim(); // Supprime les espaces inutiles en début et fin
}

// Fonction pour traiter un fichier HTML
function processHTMLFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier : ${filePath}`, err.message);
            return;
        }

        // Nettoyage des séquences invalides
        const cleanedHTML = cleanInvalidSequences(data);

        // Réécriture du fichier nettoyé
        fs.writeFile(filePath, cleanedHTML, 'utf8', err => {
            if (err) {
                console.error(`Erreur lors de l'écriture du fichier : ${filePath}`, err.message);
            } else {
                console.log(`Fichier nettoyé avec succès : ${filePath}`);
            }
        });
    });
}

// Fonction pour parcourir un dossier et traiter les fichiers HTML
function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Erreur lors de la lecture du dossier : ${directory}`, err.message);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(directory, file);

            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    console.error(`Erreur lors de la vérification du fichier : ${fullPath}`, err.message);
                    return;
                }

                if (stats.isDirectory()) {
                    processDirectory(fullPath); // Récursivité pour les sous-dossiers
                } else if (stats.isFile() && fullPath.endsWith('.html')) {
                    processHTMLFile(fullPath);
                }
            });
        });
    });
}

// Dossier contenant les fichiers HTML
const templateDirectory = path.join(__dirname, '../../public/templates/');

// Lancer le traitement
console.log(`Traitement des fichiers dans le dossier : ${templateDirectory}`);
if (fs.existsSync(templateDirectory)) {
    processDirectory(templateDirectory);
} else {
    console.error(`Le dossier spécifié n'existe pas : ${templateDirectory}`);
}