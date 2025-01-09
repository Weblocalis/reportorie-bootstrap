const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

// Chemin racine des projets
const ROOT_DIR = path.join(__dirname, 'mes-projets-web');

// Fonction pour scanner les fichiers HTML
function scanHTMLFiles(dir) {
    const results = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results.push(...scanHTMLFiles(filePath));
        } else if (file.endsWith('.html')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const hasViewport = content.includes('<meta name="viewport"');
            results.push({ file: filePath, hasViewport });
        }
    });

    return results;
}

// Route pour scanner les fichiers
app.get('/scan', (req, res) => {
    const results = scanHTMLFiles(ROOT_DIR);
    res.json(results);
});

// Route pour ajouter/remplacer la balise viewport
app.post('/update', express.json(), (req, res) => {
    const { file, action } = req.body;

    const content = fs.readFileSync(file, 'utf8');
    let updatedContent;

    if (action === 'add') {
        updatedContent = content.replace(
            /<head>/i,
            '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
    } else if (action === 'replace') {
        updatedContent = content.replace(
            /<meta name="viewport"[^>]*>/i,
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
    }

    fs.writeFileSync(file, updatedContent, 'utf8');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});