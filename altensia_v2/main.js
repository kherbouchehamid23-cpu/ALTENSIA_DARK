/**
 * ALTENSIA - Logique de l'application (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVIGATION ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const btnNavs = document.querySelectorAll('.btn-nav');

    function showPage(targetId) {
        pages.forEach(p => p.classList.remove('active'));
        navItems.forEach(n => {
            n.classList.remove('active');
            if(n.getAttribute('data-target') === targetId) n.classList.add('active');
        });

        const targetPage = document.getElementById('page-' + targetId);
        if(targetPage) targetPage.classList.add('active');
        
        // Scroll en haut de la zone main
        document.querySelector('.main').scrollTo(0, 0);
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => showPage(item.getAttribute('data-target')));
    });

    btnNavs.forEach(btn => {
        btn.addEventListener('click', () => showPage(btn.getAttribute('data-target')));
    });

    document.getElementById('logo-home').addEventListener('click', () => showPage('accueil'));


    // --- DIAGNOSTIC IA ---
    let currentStep = 0;
    let score = 0;
    const totalSteps = 1; // Simplifié pour cet exemple, augmentez selon vos questions

    const startBtn = document.getElementById('start-diag');
    const pBar = document.getElementById('p-bar');

    if(startBtn) {
        startBtn.addEventListener('click', () => {
            document.getElementById('s-0').classList.remove('active');
            document.getElementById('s-1').classList.add('active');
            pBar.style.width = '50%';
        });
    }

    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            score = parseInt(btn.getAttribute('data-pts'));
            showResults();
        });
    });

    function showResults() {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.getElementById('s-res').classList.add('active');
        pBar.style.width = '100%';
        
        const fScore = document.getElementById('f-score');
        const fTitle = document.getElementById('f-title');
        
        fScore.textContent = (score * 5) + "%"; // Calcul factice
        fTitle.textContent = score > 10 ? "Profil Avancé" : "Opportunité Majeure";
    }

    document.getElementById('get-plan').addEventListener('click', () => {
        const msg = document.getElementById('msg-field');
        msg.value = "J'ai réalisé le diagnostic IA (Score: " + document.getElementById('f-score').textContent + "). Je souhaite recevoir mon plan d'action.";
        showPage('contact');
    });


    // --- FORMULAIRE CONTACT ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = "Envoi...";

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if(response.ok) {
                    btn.textContent = "Merci !";
                    contactForm.reset();
                } else {
                    btn.textContent = "Erreur";
                }
            } catch (err) {
                btn.textContent = "Erreur réseau";
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }, 3000);
            }
        });
    }
});
