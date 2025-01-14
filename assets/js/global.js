document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("template-gallery");

    // Charger les données depuis le fichier JSON
    fetch('data/global-template.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des templates: ${response.statusText}`);
            }
            return response.json();
        })
        .then(templates => {
            // Générer les cartes dynamiques
            templates.forEach(template => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card shadow-sm">
                      
                        <span class="badge bg-success position-absolute top-0 start-0 m-2">Nouveau</span>
                        <img src="${template.thumbnail}" class="card-img-top" alt="${template.title}">
                        <div class="card-body">
                            <h5 class="card-title">${template.title}</h5>
                            
                            
                            <ul class="list-unstyled">
    <li><i class="bi bi-bootstrap-fill text-primary"></i> <strong>Version Bootstrap :</strong> ${template.bootstrapVersion}</li>
    <li><i class="bi bi-browser-chrome text-warning"></i> <strong>Navigateurs compatibles :</strong> ${template.compatibleBrowsers}</li>
    <li><i class="bi bi-code-slash text-success"></i> <strong>Technologies :</strong> ${template.technologies}</li>
    <li><i class="bi bi-box-seam text-danger"></i> <strong>Dépendances :</strong> ${template.dependencies}</li>
    <li><i class="bi bi-phone text-info"></i> <strong>Responsive :</strong> ${template.responsive ? "Oui" : "Non"}</li>
</ul>
                           
                           
                           
                           
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary btn-preview" data-url="${template.url}" data-bs-toggle="modal" data-bs-target="#templateModal">
                                    Aperçu
                                </button>
                                <a href="${template.url}" class="btn btn-secondary" target="_blank">Télécharger</a>
                            </div>
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });

            // Ajouter un événement pour les boutons Aperçu
            document.querySelectorAll('.btn-preview').forEach(button => {
                button.addEventListener('click', function () {
                    const previewUrl = this.getAttribute('data-url');
                    document.getElementById('templatePreview').src = previewUrl;
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des templates :', error);
            gallery.innerHTML = `<p class="text-danger">Impossible de charger les templates pour le moment.</p>`;
        });
});