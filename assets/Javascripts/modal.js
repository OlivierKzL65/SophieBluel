
async function initModal() {

    const modal = document.querySelector('#modal');
    const openBtn = document.querySelector('.edit__btn');
    const closeBtn = document.querySelector('.js-modal-close');
    const addViewBtn = document.querySelector('.js-modal-add-view');
    const backBtn = document.querySelector('.js-modal-back');
    const form = document.querySelector('#modal-add-form');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        displayView('gallery'); 
        refreshModalData();
    });

    // Ferme la modale clic surcroix
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetModalForm();
    });

    // Ferme modale si  clic en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModalForm(); 
        }
    });

    addViewBtn.addEventListener('click', () => displayView('add'));
    backBtn.addEventListener('click', () => displayView('gallery'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitWork();
    });

    setupFormBehavior();

    return true;
}

// Met a jour les donnees affich dans modale (projets et catégories)
async function refreshModalData() {
    const galleryContainer = document.querySelector('.js-admin-gallery');
    const categorySelect = document.querySelector('#category');

    // Recup/affichage projets
    const works = await fetch("http://localhost:5678/api/works").then(res => res.json());
    galleryContainer.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.className = 'modal__gallery-item';
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <span class="modal__trash">
                <i class="fa-solid fa-trash-can"></i>
            </span>
        `;
        
        figure.querySelector('.modal__trash').addEventListener('click', () => deleteWork(work.id));
        galleryContainer.appendChild(figure);
    });

    if (categorySelect.options.length <= 1) {
        const categories = await fetch("http://localhost:5678/api/categories").then(res => res.json());
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.innerText = cat.name;
            categorySelect.appendChild(option);
        });
    }
}

// Suppun projet bdd
async function deleteWork(id) {
    const token = localStorage.getItem("token");
    
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
        await refreshModalData(); 
        if (window.updateGallery) {
            await window.updateGallery(); 
        }
    }
}

// Envoie nouveau projet a bdd
async function submitWork() {
    const token = localStorage.getItem("token");
    const form = document.querySelector('#modal-add-form');
    const formData = new FormData(form);

    //Appel API pour ajout
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });

    //succes = ferme-reset-mise a jour acceuil
    if (response.ok) {
        const modal = document.querySelector('#modal');
        modal.style.display = 'none';
        resetModalForm();
        
        if (window.updateGallery) {
            await window.updateGallery(); 
        }
    } else {
        alert("Erreur lors de l'envoi du projet");
    }
}

// Gere changement affich entre la galerie et formulaire ajout
function displayView(view) {
    const galleryView = document.querySelector('#modal-view-gallery');
    const addView = document.querySelector('#modal-view-add');
    const backBtn = document.querySelector('.js-modal-back');

    if (view === 'gallery') {
        galleryView.style.display = 'flex';
        addView.style.display = 'none';
        backBtn.style.visibility = 'hidden';
    } else {
        galleryView.style.display = 'none';
        addView.style.display = 'flex';
        backBtn.style.visibility = 'visible';
    }
}

// Gere affichage aperçu de image selec
function handleFilePreview() {
    const input = document.querySelector('#file-upload');
    const preview = document.querySelector('.js-preview');
    const content = document.querySelector('.js-dropzone-content');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "block";
            content.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
}

// Reset form
function resetModalForm() {
    const form = document.querySelector('#modal-add-form');
    const preview = document.querySelector('.js-preview');
    const dropzoneContent = document.querySelector('.js-dropzone-content');
    
    if (form) form.reset();
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
    if (dropzoneContent) {
        dropzoneContent.style.display = "flex";
    }
    
    const submitBtn = document.querySelector('.js-modal-submit');
    if (submitBtn) submitBtn.disabled = true;
}

// Verif champs remplis pour activer bouton valider
function setupFormBehavior() {
    const input = document.querySelector('#file-upload');
    const title = document.querySelector('#title');
    const category = document.querySelector('#category');
    const submitBtn = document.querySelector('.js-modal-submit');

    //verif champs
    const checkForm = () => {
        submitBtn.disabled = !(input.files[0] && title.value && category.value);
    };

    input.addEventListener('change', () => {
        handleFilePreview();
        checkForm();
    });
    title.addEventListener('input', checkForm);
    category.addEventListener('change', checkForm);
}

initModal();