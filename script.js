"scripts": {
  "start": "node index.js"
}

// Burger Menu Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        // Animation du burger
        burger.classList.toggle('toggle');
    });
} else {
    console.error("Burger menu ou nav-links non trouvés dans le DOM.");
}

// Gestion des traductions
const languageSelector = document.getElementById('languages');
const elements = document.querySelectorAll('[data-key]');
const elementsPlaceholder = document.querySelectorAll('[data-key-placeholder]');
const elementsAlt = document.querySelectorAll('[data-key-alt]');

// Fonction pour charger le fichier de langue
async function loadLanguage(lang) {
    console.log(`Chargement de la langue: ${lang}`);
    try {
        const response = await fetch(`languages/${lang}.json`);
        console.log(`Réponse de fetch: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        const translations = await response.json();
        console.log('Traductions chargées:', translations);
        updateContent(translations);

        // Gérer la direction du texte
        document.body.classList.toggle('rtl', lang === 'ar');

        // Enregistrer la langue sélectionnée dans le localStorage
        localStorage.setItem('languages', lang);
    } catch (error) {
        console.error("Erreur lors du chargement de la langue:", error);
    }
}

// Fonction pour mettre à jour le contenu
function updateContent(translations) {
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[key]) {
            element.textContent = translations[key];
        }

        // Mettre à jour le titre de la page si nécessaire
        if (key === "nav.accueil") {
            document.title = translations[key];
        }
    });

    elementsPlaceholder.forEach(element => {
        const placeholderKey = element.getAttribute('data-key-placeholder');
        if (translations[placeholderKey]) {
            element.setAttribute('placeholder', translations[placeholderKey]);
        }
    });

    elementsAlt.forEach(element => {
        const altKey = element.getAttribute('data-key-alt');
        if (translations[altKey]) {
            element.setAttribute('alt', translations[altKey]);
        }
    });
}

// Écouter les changements de langue
if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
        loadLanguage(e.target.value);
    });
} else {
    console.error("Sélecteur de langue non trouvé dans le DOM.");
}

// Charger la langue par défaut ou la langue enregistrée
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('languages') || 'en';
    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }
    loadLanguage(savedLanguage);
});
