document.addEventListener("DOMContentLoaded", async function () {
    const body = document.querySelector("body")
    const form = document.querySelector("form");
    const lastNameInput = document.getElementById("lastName");
    const firstNameInput = document.getElementById("firstName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let apiUserData = {};

    async function fetchUserData() {
        try {
            const response = await fetch("https://randomuser.me/api/");
            const data = await response.json();
            const user = data.results[0];

            apiUserData = {
                address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
                phone: user.phone,
                profilePicture: user.picture.large,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des données API", error);
            alert("Impossible de récupérer les données utilisateur.");
        }
    }

    await fetchUserData();

    function validateInput(input, regex, errorMessage) {
        if (!input.value.trim()) {
            alert("Tous les champs doivent être remplis !");
            input.focus();
            return false;
        }

        if (!regex.test(input.value)) {
            alert(errorMessage);
            console.log('input :>> ', input);
            input.focus();
            return false;
        }
        return true;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!lastNameInput.value.trim() || !firstNameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value.trim()) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        if (!validateInput(emailInput, emailRegex, "Adresse e-mail invalide !")) return;
        if (!validateInput(passwordInput, passwordRegex, "Mot de passe non sécurisé !\n(Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial)")) return;

        const userData = {
            lastName: lastNameInput.value,
            firstName: firstNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            ...apiUserData,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        document.cookie = `email=${userData.email}; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;

        displayUserData(userData);

        // fetch("https://randomuser.me/api/")
        //     .then(response => response.json())
        //     .then(data => {
        //         const user = data.results[0];
        //         userData.address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`;
        //         userData.phone = user.phone;
        //         userData.profilePicture = user.picture.large;
        //         localStorage.setItem("userData", JSON.stringify(userData));
        //     })
        //     .catch(error => console.error("Erreur lors de la récupération des données API", error));

        // alert("Inscription réussie !");
        body.classList.add("goOut")
    });

    function displayUserData(user) {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = user.profilePicture;
        card.appendChild(img);

        const content = document.createElement("div");

        const title = document.createElement("h2");
        title.textContent = `${user.firstName} ${user.lastName}`;
        content.appendChild(title);

        const socials = document.createElement("div");
        socials.className = "socials";

        function createSocialButton(iconClass, text) {
            const socialDiv = document.createElement("div");

            const button = document.createElement("button");
            const spanIcon = document.createElement("span");
            const icon = document.createElement("i");
            icon.className = iconClass;
            spanIcon.appendChild(icon);
            button.appendChild(spanIcon);

            const spanText = document.createElement("span");
            spanText.className = "text";
            spanText.textContent = text;

            socialDiv.appendChild(button);
            socialDiv.appendChild(spanText);

            return socialDiv;
        }

        socials.appendChild(createSocialButton("fas fa-house-user", user.address));
        socials.appendChild(createSocialButton("fas fa-envelope", user.email));
        socials.appendChild(createSocialButton("fas fa-phone", user.phone));

        content.appendChild(socials);
        card.appendChild(content);

        document.body.appendChild(card);
    }
});
