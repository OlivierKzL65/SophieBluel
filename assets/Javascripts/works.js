async function init() {
    const projets = await getWorks(); //recupere les projets sur le backend
    
    if (!projets) {
        return false; //pas de reponse = arret fonction
    }

    const affichage = showWorks(projets); //si reponse ok lance affichage
    return affichage;
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

function showWorks(listeProjets) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return false;

    gallery.innerHTML = '';

    listeProjets.forEach(projet => {
        //cree elements pour chaque projet
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const legende = document.createElement('figcaption');

        //rempli l'api
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

init();