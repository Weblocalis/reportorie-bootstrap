// Définir le Custom Element pour le header
class AppHeader extends HTMLElement {
    connectedCallback() {
        fetch('../components/header.html') // Chemin corrigé
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;
            });
    }
}
customElements.define('app-header', AppHeader);

// Définir le Custom Element pour le footer
class AppFooter extends HTMLElement {
    connectedCallback() {
        fetch('../components/footer.html') // Chemin corrigé
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;
            });
    }
}
customElements.define('app-footer', AppFooter);

// Définir le Custom Element pour la section "À propos"
class AppAbout extends HTMLElement {
    connectedCallback() {
        fetch('../components/about.html') // Chemin corrigé
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;
            });
    }
}
customElements.define('app-about', AppAbout);