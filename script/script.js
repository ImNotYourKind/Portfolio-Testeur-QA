// Fonction pour gérer les effets de défilement : changements de la barre de navigation, section active et opacité du fond
function handleScrollEffects() {
    const header = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-item");
    const footer = document.querySelector("footer#contact");
    
    // Ajouter le footer aux sections pour les besoins d'animation
    const allSections = [...sections];
    if (footer) allSections.push(footer);

    window.onscroll = function () {
        const top = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Changer la couleur de la barre de navigation lors du défilement
        if (top >= 100) {
            header.classList.add("navbarScroll");
        } else {
            header.classList.remove("navbarScroll");
        }

        // Mettre en surbrillance la section active dans la barre de navigation et animer les arrière-plans
        let currentSection = '';
        
        // Parcourir toutes les sections pour gérer l'opacité de l'arrière-plan et la navigation active
        allSections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionTop = section.offsetTop - windowHeight/2;
            const sectionBottom = sectionTop + section.offsetHeight + windowHeight/2;
            const sectionHeight = sectionBottom - sectionTop;
            
            // Calculer à quel point nous avons défilé dans la section (de 0 à 1)
            let scrollProgress = 0;
            
            if (top < sectionTop) {
                // Avant la section
                scrollProgress = 0;
            } else if (top > sectionBottom) {
                // Après la section
                scrollProgress = 0;
            } else {
                // À l'intérieur de la plage de visualisation de la section
                scrollProgress = (top - sectionTop) / sectionHeight;
                
                // Faire culminer au milieu (courbe en cloche)
                scrollProgress = 1 - Math.abs((scrollProgress - 0.5) * 2);
                scrollProgress = Math.pow(scrollProgress, 1.5); // Ajuster la courbe
                
                // Définir comme section actuelle pour la barre de navigation
                if (top >= section.offsetTop - 100 && 
                    top < section.offsetTop + section.offsetHeight - 100) {
                    currentSection = sectionId;
                }
            }
            
            // Appliquer l'opacité à l'arrière-plan
            const beforeElement = section.querySelector(':scope > :first-child');
            if (beforeElement && section.id !== 'home') { // Ne pas animer la section d'accueil
                // L'opacité cible varie de 0,1 à 0,8 en fonction de la progression du défilement
                const targetOpacity = 0.1 + (scrollProgress * 0.7);
                section.style.setProperty('--bg-opacity', targetOpacity);
            }
        });
        
        // Détection spéciale pour la section contact (footer)
        // Si on est proche du bas de la page, activer la section contact
        if (top + windowHeight >= documentHeight - 50) {
            currentSection = 'contact';
        }
        
        // Mettre à jour l'élément de navigation actif
        navItems.forEach(item => {
            item.classList.remove('active');
            const navLink = item.querySelector('.nav-link');
            if (navLink && navLink.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    };
}

// Fonction pour gérer la réduction de la barre de navigation sur les petits appareils après un clic
function handleNavbarCollapse() {
    const navLinks = document.querySelectorAll(".nav-item");
    const menuToggle = document.getElementById("navbarSupportedContent");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            new bootstrap.Collapse(menuToggle).toggle();
        });
    });
}

// Fonction pour créer dynamiquement des éléments HTML à partir du fichier JSON
function createSkillsFromJSON() {
    const container = document.querySelector("#skills .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Charger le fichier JSON
    fetch("./data/skills.json")
        .then((response) => response.json())
        .then((data) => {
            // Iterate through the JSON data and create HTML elements
            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                card.innerHTML = `
                    <div class="card skillsText">
                        <div class="card-body">
                            <img src="./images/${item.image}" alt="logo de ${item.title}" width="64" height="64" loading="lazy"/>
                            <h3 class="card-title mt-3">${item.title}</h3>
                            <p class="card-text mt-3">${item.text}</p>
                        </div>
                    </div>
                `;

                // Append the card to the current row
                row.appendChild(card);

                // If the index is a multiple of 3 or it's the last element, create a new row
                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}
// Fonction pour créer dynamiquement des éléments HTML à partir du fichier JSON
function createPortfolioFromJSON() {
    const container = document.querySelector("#portfolio .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Charger le fichier JSON
    fetch("./data/portfolio.json")
        .then((response) => response.json())
        .then((data) => {
            // Iterate through the JSON data and create HTML elements
            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                let missionsList = "";
                item.missions.forEach(mission => {
                    missionsList += `<li>${mission.description}</li>`;
                });
                
                card.innerHTML = `
                    <div class="card portfolioContent">
                    <img class="card-img card-img-top" src="images/${item.image}" alt="image du projet ${item.title}" width="800" height="600" loading="lazy">
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-text card-description">${item.text}</p>
                        <ul class= " custom-list mt-3">${missionsList}</ul>
                         
                        <div class="text-center">
                            <a href="${item.link}" target="_blank" class="btn button-link">Lien</a>
                        </div>
                    </div>
                </div>
                `;

                // Append the card to the current row
                row.appendChild(card);

                // If the index is a multiple of 3 or it's the last element, create a new row
                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}

// Appeler les fonctions pour exécuter le code
handleScrollEffects();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
