const order = ['accueil','parcours','offres','engagements','contact'];

function goTo(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  if (el && el.classList && el.classList.contains('nav-item')) {
    el.classList.add('active');
  } else {
    const idx = order.indexOf(id);
    const items = document.querySelectorAll('.nav-item');
    if (idx >= 0 && items[idx]) items[idx].classList.add('active');
  }
  document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeevqken";
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "form-status";
    const formData = new FormData(form);
    if (formData.get("website")) {
      statusEl.textContent = "Message envoye.";
      statusEl.classList.add("success");
      form.reset();
      return;
    }
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const organization = String(formData.get("organization") || "").trim();
    const message = String(formData.get("message") || "").trim();
    if (!name || !email || !message) {
      statusEl.textContent = "Merci de renseigner les champs obligatoires.";
      statusEl.classList.add("error");
      return;
    }
    try {
      statusEl.textContent = "Envoi en cours...";
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, message })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || "Impossible d'envoyer le message.");
      statusEl.textContent = "Votre message a bien ete envoye.";
      statusEl.classList.add("success");
      form.reset();
    } catch (err) {
      statusEl.textContent = err.message || "Une erreur est survenue.";
      statusEl.classList.add("error");
    }
  });
}
