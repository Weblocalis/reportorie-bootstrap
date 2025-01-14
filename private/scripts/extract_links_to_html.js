const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const htmlFilePath = './private/index.html'; // Chemin du fichier HTML
const domain = 'https://www.meublesphere.fr'; // Domaine principal

// Fonction pour obtenir le statut HTTP
async function getHttpStatus(url) {
    try {
        const response = await axios.head(url, { timeout: 5000 });
        return response.status;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return 'Error';
    }
}

// Fonction pour analyser les liens
async function fetchLinksFromPage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const links = [];

        const linkPromises = $('a').map(async (_, element) => {
            const href = $(element).attr('href');
            if (href) {
                const fullUrl = href.startsWith('/') ? `${domain}${href}` : href;
                const isInternal = href.startsWith('/') || href.startsWith(domain);
                const type = isInternal ? `Interne (Meublesphere)` : `Externe (Autre domaine)`;
                const status = await getHttpStatus(fullUrl);
                links.push({ url: fullUrl, type, status });
            }
        }).get();

        await Promise.all(linkPromises);
        return links;
    } catch (error) {
        console.error(`Erreur lors de l'extraction des liens : ${error.message}`);
        return [];
    }
}

// Fonction principale
async function main() {
    console.log('Extraction des liens...');
    const links = await fetchLinksFromPage(domain);

    // Charger le fichier HTML
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    // Sélectionner le tableau et vider les anciennes données
    const tableBody = $('#datatablesSimple tbody');
    tableBody.empty();

    // Ajouter les nouvelles données
    links.forEach((link, index) => {
        const newRow = `
            <tr>
                <td>${index + 1}</td>
                <td><a href="${link.url}" target="_blank">${link.url}</a></td>
                <td>${link.type}</td>
                <td>${link.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.append(newRow);
    });

    // Sauvegarder les modifications
    fs.writeFileSync(htmlFilePath, $.html(), 'utf8');
    console.log('Les données ont été injectées dans le tableau.');
}

main();
