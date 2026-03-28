"use client";

/**
 * TrustBadge — affiche le niveau de preuve du profil
 *
 * Logique :
 *   hasDocument + hasVideo  → badge "Profil vérifié"   (vert)
 *   hasDocument uniquement  → badge "Document dispo"   (bleu)
 *   hasVideo uniquement     → badge "Vidéo dispo"       (violet)
 *   aucun                   → badge "Aucune preuve"    (gris)
 */
export default function TrustBadge({ hasDocument = false, hasVideo = false }) {
  if (hasDocument && hasVideo) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
        ✅ Profil vérifié
      </span>
    );
  }
  if (hasDocument) {
    return (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
        📄 Document disponible
      </span>
    );
  }
  if (hasVideo) {
    return (
      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
        🎥 Vidéo disponible
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-1 rounded-full">
      ⚠️ Aucune preuve
    </span>
  );
}
