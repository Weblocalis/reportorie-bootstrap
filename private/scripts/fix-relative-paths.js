const fs = require('fs');
const path = require('path');

// Fonction pour remplacer une ligne spécifique dans un fichier HTML
function replaceScriptSrc(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier : ${filePath}`, err.message);
            return;
        }

        // Expression régulière pour trouver les balises <script> avec le chemin relatif spécifique
        const regex = /<script src="\.\.\/assets\/js\/color-modes\.js"><\/script>/g;

        // Nouvelle ligne à insérer
        const replacement = '<script src="/assets/js/color-modes.js"></script>';

        // Remplacement dans le contenu du fichier
        const updatedData = data.replace(regex, replacement);

        // Vérification si une modification a été effectuée
        if (updatedData !== data) {
            fs.writeFile(filePath, updatedData, 'utf8', err => {
                if (err) {
                    console.error(`Erreur lors de l'écriture du fichier : ${filePath}`, err.message);
                } else {
                    console.log(`Fichier mis à jour avec succès : ${filePath}`);
                }
            });
        } else {
            console.log(`Aucune modification nécessaire pour : ${filePath}`);
        }
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
                    replaceScriptSrc(fullPath);
                }
            });
        });
    });
}

// Dossier contenant les fichiers HTML
const templatesDir = path.join(__dirname, '../../public/templates/');

// Lancer le traitement
console.log(`Traitement des fichiers dans le dossier : ${templatesDir}`);
if (fs.existsSync(templatesDir)) {
    processDirectory(templatesDir);
} else {
    console.error(`Le dossier spécifié n'existe pas : ${templatesDir}`);
}