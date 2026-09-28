// Appel a l'API Gemini (Google) avec un modele recent et gratuit.
// - Modele par defaut : alias "gemini-flash-lite-latest", qui suit toujours
//   la derniere version Flash-Lite (evite de casser quand Google retire un modele).
// - Si ce modele n'existe pas, on retente avec des modeles de secours.
// - On peut forcer un autre modele avec la variable Vercel GEMINI_MODEL.

const MODELES = [
  process.env.GEMINI_MODEL,
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
].filter(Boolean);

function messageErreur(status, detail) {
  if (status === 429) return "Limite gratuite de l'IA atteinte pour le moment. Réessaie dans quelques minutes, ou saisis le médicament à la main.";
  if (status === 400 && /API key/i.test(detail)) return 'Clé Gemini invalide : vérifie GEMINI_API_KEY sur Vercel.';
  if (status === 403) return "Clé Gemini refusée : vérifie qu'elle est active dans Google AI Studio.";
  return `Erreur de l'IA (code ${status}).`;
}

// body : le contenu JSON envoye a generateContent
// Renvoie { ok: true, texte } ou { ok: false, erreur, detail, status }
export async function appelerGemini(apiKey, body) {
  let dernier = null;
  for (const modele of MODELES) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (res.ok) {
      const data = await res.json();
      const texte = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
      return { ok: true, texte, modele };
    }
    const detail = await res.text();
    dernier = { ok: false, status: res.status, detail, erreur: messageErreur(res.status, detail) };
    // Modele introuvable : on essaie le suivant. Autre erreur : on s'arrete.
    if (res.status !== 404) break;
  }
  return dernier;
}
