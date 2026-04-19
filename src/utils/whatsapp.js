/** Numéro officiel TalentProof (sans le +) */
export const TP_PHONE = "2250507939706";

/**
 * Génère un lien WhatsApp pour contacter un talent (message personnalisé).
 * @param {string} nom    — prénom/nom du talent
 * @param {string} metier — métier/domaine du talent
 * @param {string} phone  — numéro WhatsApp du talent (format international sans +)
 */
export function waLink(nom, metier = "", phone = "") {
  const msg = metier
    ? `Bonjour ${nom}, j'ai vu votre preuve de ${metier} sur TalentProof et je souhaite échanger avec vous.`
    : `Bonjour ${nom}, j'ai vu votre profil sur TalentProof et je souhaite échanger avec vous.`;
  const base = phone ? `https://wa.me/${phone}` : `https://wa.me/${TP_PHONE}`;
  return `${base}?text=${encodeURIComponent(msg)}`;
}

/**
 * Génère un lien WhatsApp pour écrire à TalentProof directement.
 * @param {string} sujet — sujet du message
 */
export function waTalentProof(sujet = "") {
  const msg = sujet
    ? `Bonjour TalentProof, ${sujet}`
    : `Bonjour TalentProof, je souhaite en savoir plus.`;
  return `https://wa.me/${TP_PHONE}?text=${encodeURIComponent(msg)}`;
}

/**
 * Génère un lien WhatsApp pour partager un profil talent.
 * @param {string} nom    — prénom/nom du talent
 * @param {string} metier — métier du talent
 * @param {string} ville  — ville du talent
 */
export function waShare(nom, metier, ville) {
  const msg = `👤 Profil TalentProof : *${nom}* — ${metier} à ${ville}.\nRetrouvez ses preuves de compétences sur TalentProof !`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}
