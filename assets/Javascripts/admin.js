function initAdmin() {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    activateAdminMode();
    handleLogout();

    return true;
}

//affiche outil edit
function activateAdminMode() {
    const editBar = document.querySelector(".edit-bar");
    if (editBar) editBar.style.display = "flex";

    const editBtns = document.querySelectorAll(".edit__btn");
    editBtns.forEach(btn => btn.style.display = "flex");

    const filters = document.querySelector(".filters");
    if (filters) filters.style.display = "none";

    const authLink = document.querySelector(".nav__link");
    if (authLink) authLink.innerText = "logout";
}

//deco utilisateur
 function handleLogout() {
    const authLink = document.querySelector(".nav__link");
    if (!authLink) return;

    authLink.addEventListener("click", (event) => {
        if (authLink.innerText === "logout") {
            event.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.reload();
        }
    });
}

initAdmin();