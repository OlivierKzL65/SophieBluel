let tousLesProjets = []; //garde liste pour le filtrage sans rappel api

async function init() {
    tousLesProjets = await getWorks();
    const categories = await getCategories();
    if (!tousLesProjets || !categories) {
        return false;
    }

    createFilters(categories);
    showWorks(tousLesProjets);
    
    return true;
}

async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) return false;
        return await response.json();
    } catch (error) {
        return false;
    }
}
//recup les categorie
async function getCategories() { 
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) return false;
        return await response.json();
    } catch (e) {
        return false;
    }
}

function showWorks(listeProjets) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return false;

    gallery.innerHTML = '';

    listeProjets.forEach(projet => {
        //cree elements pour chaque projet
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const legende = document.createElement('figcaption');

        //rempli api
        image.src = projet.imageUrl;
        image.alt = projet.title;
        legende.innerText = projet.title;

        //ajoute a la galerie
        figure.appendChild(image);
        figure.appendChild(legende);
        gallery.appendChild(figure);
    });

    return true;
}

function createFilters(categories) {
    const filtersContainer = document.querySelector('.filters');
    if (!filtersContainer) return false;

    //Bouton Tous
    const btnTous = document.createElement('button');
    btnTous.innerText = "Tous";
    btnTous.classList.add('filters__btn', 'filters__btn--active');
    btnTous.addEventListener('click', () => {
        updateFilterUI(btnTous);
        showWorks(tousLesProjets);
    });
    filtersContainer.appendChild(btnTous);

    //bouton pour chaque catégorie
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat.name;
        btn.classList.add('filters__btn');
        btn.addEventListener('click', () => {
            updateFilterUI(btn);
            const filtres = tousLesProjets.filter(p => p.categoryId === cat.id);
            showWorks(filtres);
        });
        filtersContainer.appendChild(btn);
    });
    return true;
}

//changer couleur bouton actif
function updateFilterUI(selectedBtn) {
    const buttons = document.querySelectorAll('.filters__btn');
    buttons.forEach(b => b.classList.remove('filters__btn--active'));
    selectedBtn.classList.add('filters__btn--active');
}

async function updateGallery() {
    tousLesProjets = await getWorks();
    showWorks(tousLesProjets);
}

window.updateGallery = updateGallery;

init();