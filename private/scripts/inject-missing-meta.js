const fs = require('fs');
const path = require('path');

// Balises méta à standardiser avec leurs valeurs et ordre
const standardMetaTags = [
    { tag: '<meta charset="UTF-8">', key: 'charset="UTF-8"' },
    
    { tag: '<meta http-equiv="X-UA-Compatible" content="IE=edge">', key: 'http-equiv="X-UA-Compatible"' },
    
    
    { tag: '<meta name="viewport" content="width=device-width, initial-scale=1.0">', key: 'name="viewport"' },
    
    { tag: '<meta http-equiv="Content-Language" content="fr">', key: 'http-equiv="Content-Language"' },
    
    { tag: '<meta name="description" content="Description concise du contenu de la page.">', key: 'name="description"' },
    
    
    { tag: '<meta name="author" content="Votre nom ou organisation">', key: 'name="author"' },
    
    
    { tag: '<meta name="robots" content="index, follow">', key: 'name="robots"' }
];

// Fonction pour parcourir récursivement un dossier
function traverseDirectory(directory, callback) {
    console.log(`Exploration du dossier : ${directory}`);
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Erreur lors de la lecture du dossier : ${err.message}`);
            return;
        }
        files.forEach((file) => {
            const fullPath = path.join(directory, file);
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    console.error(`Erreur lors de la vérification du fichier : ${err.message}`);
                    return;
                }
                if (stats.isDirectory()) {
                    traverseDirectory(fullPath, callback); // Récursivité
                } else if (stats.isFile() && fullPath.endsWith('.html')) {
                    callback(fullPath);
                }
            });
        });
    });
}

// Fonction pour nettoyer, réorganiser et normaliser les balises méta
function cleanAndOrganizeMetaTags(filePath, standardMetaTags) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erreur lors de la lecture du fichier : ${filePath}, ${err.message}`);
            return;
        }

        // Localisation de la section <head>
        const headStart = data.indexOf('<head>');
        const headEnd = data.indexOf('</head>');
        if (headStart === -1 || headEnd === -1) {
            console.error(`Balise <head> introuvable dans : ${filePath}`);
            return;
        }

        let headContent = data.substring(headStart + 6, headEnd); // Contenu entre <head> et </head>
        let modified = false;

        // Supprimer tous les doublons des balises méta spécifiées
        standardMetaTags.forEach(({ key }) => {
            const regex = new RegExp(`<meta [^>]*${key}[^>]*>`, 'gi');
            headContent = headContent.replace(regex, ''); // Supprime toutes les occurrences
        });

        // Ajouter et réorganiser les balises méta dans l'ordre standard
        let organizedMetaTags = '';
        standardMetaTags.forEach(({ tag }) => {
            organizedMetaTags += `    ${tag}\n`;
        });

        headContent = organizedMetaTags + headContent.trim();
        modified = true;

        // Remplacement dans le fichier si modifié
        if (modified) {
            const updatedData = `${data.substring(0, headStart + 6)}\n${headContent.trim()}\n${data.substring(headEnd)}`;
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error(`Erreur lors de l'écriture du fichier : ${filePath}, ${err.message}`);
                } else {
                    console.log(`Fichier nettoyé et réorganisé : ${filePath}`);
                }
            });
        } else {
            console.log(`Aucune modification nécessaire pour : ${filePath}`);
        }
    });
}

// Dossier contenant les fichiers HTML
const templateDirectory = path.join(__dirname, '../../public/templates/');
console.log(`Chemin utilisé : ${templateDirectory}`);

// Vérification de l'existence du dossier
if (!fs.existsSync(templateDirectory)) {
    console.error(`Le chemin spécifié n'existe pas : ${templateDirectory}`);
    process.exit(1);
}

// Parcourir et traiter les fichiers
traverseDirectory(templateDirectory, (filePath) => {
    cleanAndOrganizeMetaTags(filePath, standardMetaTags);
});