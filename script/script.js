// Fonction pour gérer les effets de défilement : section active
function handleScrollEffects() {
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-item");
    const footer = document.querySelector("footer#contact");
    const allSections = [...sections, footer].filter(Boolean);

    window.onscroll = function() {
        const top = window.scrollY;
        let currentSection = '';
        
        // Déterminer la section active
        allSections.forEach(section => {
            if (top >= section.offsetTop - 100 && top < section.offsetTop + section.offsetHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Détection du footer
        if (window.innerHeight + top >= document.documentElement.scrollHeight - 50) {
            currentSection = 'contact';
        }
        
        // Mettre à jour la navigation
        navItems.forEach(item => {
            const navLink = item.querySelector('.nav-link');
            item.classList.toggle('active', navLink && navLink.getAttribute('href') === `#${currentSection}`);
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

// Fonction générique pour créer du contenu depuis JSON
function createContentFromJSON(containerId, jsonPath, cardCreator) {
    const container = document.querySelector(`#${containerId} .container`);
    let row = document.createElement("div");
    row.classList.add("row");

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                card.innerHTML = cardCreator(item);
                row.appendChild(card);
                
                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}

// Fonctions spécifiques pour chaque section
function createSkillsFromJSON() {
    createContentFromJSON('skills', './data/skills.json', item => `
        <div class="card skillsText">
            <div class="card-body">
                <img src="./images/${item.image}" alt="logo de ${item.title}" width="64" height="64" loading="lazy"/>
                <h3 class="card-title mt-3">${item.title}</h3>
                <p class="card-text mt-3">${item.text}</p>
            </div>
        </div>
    `);
}

function createPortfolioFromJSON() {
    createContentFromJSON('portfolio', './data/portfolio.json', item => {
        let missionsList = item.missions.map(mission => `<li>${mission.description}</li>`).join('');
        return `
            <a href="${item.link}" target="_blank" class="card-link">
                <div class="card portfolioContent">
                    <img class="card-img card-img-top" src="images/${item.image}" alt="image du projet ${item.title}" width="800" height="600" loading="lazy">
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-text card-description">${item.text}</p>
                        <ul class="custom-list mt-3">${missionsList}</ul>
                    </div>
                </div>
            </a>
        `;
    });
}

// Appeler les fonctions pour exécuter le code
handleScrollEffects();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
