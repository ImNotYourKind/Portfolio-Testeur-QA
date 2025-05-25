// Function to handle scroll effects: navbar changes, active section, and background opacity
function handleScrollEffects() {
    const header = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-item");
    const footer = document.querySelector("footer#contact");
    
    // Add footer to sections for animation purposes
    const allSections = [...sections];
    if (footer) allSections.push(footer);

    window.onscroll = function () {
        const top = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Change navbar color on scroll
        if (top >= 100) {
            header.classList.add("navbarScroll");
        } else {
            header.classList.remove("navbarScroll");
        }

        // Highlight active section in navbar and animate backgrounds
        let currentSection = '';
        
        // Loop through all sections to handle background opacity and active nav
        allSections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionTop = section.offsetTop - windowHeight/2;
            const sectionBottom = sectionTop + section.offsetHeight + windowHeight/2;
            const sectionHeight = sectionBottom - sectionTop;
            
            // Calculate how far into the section we've scrolled (0 to 1)
            let scrollProgress = 0;
            
            if (top < sectionTop) {
                // Before the section
                scrollProgress = 0;
            } else if (top > sectionBottom) {
                // After the section
                scrollProgress = 0;
            } else {
                // Inside the viewing range of the section
                scrollProgress = (top - sectionTop) / sectionHeight;
                
                // Make it peak in the middle (bell curve)
                scrollProgress = 1 - Math.abs((scrollProgress - 0.5) * 2);
                scrollProgress = Math.pow(scrollProgress, 1.5); // Adjust curve
                
                // Set as current section for navbar
                if (top >= section.offsetTop - 100 && 
                    top < section.offsetTop + section.offsetHeight - 100) {
                    currentSection = sectionId;
                }
            }
            
            // Apply opacity to the background
            const beforeElement = section.querySelector(':scope > :first-child');
            if (beforeElement && section.id !== 'home') { // Don't animate home section
                // Target opacity ranges from 0.1 to 0.8 based on scrollProgress
                const targetOpacity = 0.1 + (scrollProgress * 0.7);
                section.style.setProperty('--bg-opacity', targetOpacity);
            }
        });
        
        // Update active navigation item
        navItems.forEach(item => {
            item.classList.remove('active');
            const navLink = item.querySelector('.nav-link');
            if (navLink && navLink.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    };
}

// Function to handle navbar collapse on small devices after a click
function handleNavbarCollapse() {
    const navLinks = document.querySelectorAll(".nav-item");
    const menuToggle = document.getElementById("navbarSupportedContent");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            new bootstrap.Collapse(menuToggle).toggle();
        });
    });
}

// Function to dynamically create HTML elements from the JSON file
function createSkillsFromJSON() {
    const container = document.querySelector("#skills .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Load the JSON file
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
                            <img src="./images/${item.image}" alt="logo de ${item.title}"/>
                            <h4 class="card-title mt-3">${item.title}</h4>
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
// Function to dynamically create HTML elements from the JSON file
function createPortfolioFromJSON() {
    const container = document.querySelector("#portfolio .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Load the JSON file
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
                    <img class="card-img card-img-top" src="images/${item.image}" alt="image du projet ${item.title} " style="width:100%">
                    <div class="card-body">
                        <h4 class="card-title">${item.title}</h4>
                        <p class="card-text card-description">${item.text}</p>
                        <ul class= " custom-list mt-3">${missionsList}</ul>
                         
                        <div class="text-center">
                            <a href="${item.link}" target="_blank" class="btn button-link">Documents</a>
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

// Call the functions to execute the code
handleScrollEffects();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
