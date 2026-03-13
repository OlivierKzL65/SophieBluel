//Login


async function init() {
    const loginForm = document.querySelector('.login__form');
    if (!loginForm) return false;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const success = await handleLogin(loginForm);
        
        if (success) {
            window.location.href = 'index.html';
        }
    });

    return true;
}

//Gere envoi donnees/reponse API
 
async function handleLogin(form) {
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            return true;
        } else {
            displayError("Erreur dans l’identifiant ou le mot de passe");
            return false;
        }
    } catch (error) {
        displayError("Une erreur serveur est survenue.");
        return false;
    }
}

function displayError(message) {
    //verif si erreur existe pour evite doublon
    let errorElem = document.querySelector('.login__error');
    
    if (!errorElem) {
        errorElem = document.createElement('p');
        errorElem.classList.add('login__error');
        const submitBtn = document.querySelector('.login__submit');
        submitBtn.before(errorElem);
    }
    
    errorElem.innerText = message;
    errorElem.style.color = 'red';
    errorElem.style.marginBottom = '1.5rem';
    errorElem.style.textAlign = 'center';
}

init();