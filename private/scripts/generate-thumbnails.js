const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Chemins principaux
const templatesDir = path.resolve(__dirname, '../../public/templates');
const browserPath = '/data/data/com.termux/files/usr/bin/firefox'; // Chemin de Firefox

(async () => {
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const templates = fs.readdirSync(templatesDir);

    for (const template of templates) {
      const templatePath = path.join(templatesDir, template);
      const indexFile = path.join(templatePath, 'index.html');
      const thumbnailPath = path.join(templatePath, 'thumbnail.jpg');

      // Vérifie si un fichier index.html existe
      if (fs.existsSync(indexFile)) {
        console.log(`Génération de la vignette pour : ${template}`);

        // Crée une nouvelle page Puppeteer
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        // Charge le fichier HTML local
        await page.goto(`file://${indexFile}`, { waitUntil: 'networkidle2' });

        // Capture une vignette
        await page.screenshot({ path: thumbnailPath, type: 'jpeg', quality: 80 });
        console.log(`Vignette générée : ${thumbnailPath}`);
      } else {
        console.log(`Aucun fichier index.html trouvé dans : ${template}`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la génération des vignettes :', error);
  } finally {
    await browser.close();
  }
})();