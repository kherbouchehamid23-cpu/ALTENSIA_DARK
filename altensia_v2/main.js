// ALTENSIA — main.js v2 Premium

const order = ['accueil','parcours','offres','engagements','contact'];

const pageLabels = {
  accueil:     'Vue d\'ensemble',
  parcours:    'Methodologie',
  offres:      'Propositions de valeur',
  engagements: 'Principes directeurs',
  contact:     'Prise de contact'
};

function updateBreadcrumb(id) {
  const el = document.getElementById('breadcrumb-page');
  if (el) el.textContent = pageLabels[id] || id;
}

function goTo(id, el) {
  const current = document.querySelector('.page.active');
  if (current && current.id === 'page-' + id) return;

  // Exit animation on current page
  if (current) {
    current.classList.add('exit');
    setTimeout(() => {
      current.classList.remove('active', 'exit');
    }, 180);
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el && el.classList && el.classList.contains('nav-item')) {
    el.classList.add('active');
  } else {
    const idx = order.indexOf(id);
    const items = document.querySelectorAll('.sidebar .nav-item');
    if (idx >= 0 && items[idx]) items[idx].classList.add('active');
  }

  // Show new page with delay for exit animation
  setTimeout(() => {
    const pg = document.getElementById('page-' + id);
    if (pg) {
      pg.classList.add('active');
      document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateBreadcrumb(id);
  }, current ? 160 : 0);
}

// Mobile menu
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Topbar clock
function updateClock() {
  const el = document.getElementById('topbar-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 60000);

// Contact form — Formspree
const FORMSPREE = "https://formspree.io/f/xeevqken";
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "form-status";
    const fd = new FormData(form);
    if (fd.get("website")) {
      statusEl.textContent = "Message transmis.";
      statusEl.classList.add("success");
      form.reset();
      return;
    }
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const organization = String(fd.get("organization") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!name || !email || !message) {
      statusEl.textContent = "Veuillez renseigner les champs requis.";
      statusEl.classList.add("error");
      return;
    }
    try {
      statusEl.textContent = "Transmission en cours...";
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, message })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || "Echec de la transmission.");
      statusEl.textContent = "Votre demande a bien ete transmise. Nous revenons vers vous sous 24h.";
      statusEl.classList.add("success");
      form.reset();
    } catch (err) {
      statusEl.textContent = err.message || "Une erreur est survenue.";
      statusEl.classList.add("error");
    }
  });
}
