import { appelerGemini } from '../../../lib/gemini';

// POST /api/analyser-medicament
// Reçoit { image_base64 } et retourne les informations extraites par Gemini
// (noms, présentations, quantités, prix visibles) sous forme de liste structurée.
// Le pharmacien vérifie/corrige toujours avant validation finale (voir Règle 11).

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { erreur: "GEMINI_API_KEY n'est pas encore configurée sur Vercel." },
      { status: 501 }
    );
  }

  const { image_base64, mime_type } = await request.json();
  if (!image_base64) {
    return Response.json({ erreur: 'image_base64 manquante' }, { status: 400 });
  }

  const prompt = `Analyse cette photo de médicament(s) délivré(s) en pharmacie.
Retourne UNIQUEMENT un JSON valide, sans texte autour, sous la forme :
{"medicaments": [{"nom": "...", "presentation": "...", "quantite": 1, "prix_unitaire": 0}]}
Si une information n'est pas lisible, mets null. Ne jamais inventer un prix ou un nom absent de l'image.`;

  const r = await appelerGemini(apiKey, {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mime_type || 'image/jpeg', data: image_base64 } },
        ],
      },
    ],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
  });

  if (!r.ok) {
    return Response.json({ erreur: r.erreur, detail: r.detail }, { status: 502 });
  }
  const texte = r.texte || '{}';

  let resultat;
  try {
    const nettoye = texte.replace(/```json|```/g, '').trim();
    resultat = JSON.parse(nettoye);
  } catch {
    resultat = { medicaments: [], erreur_parsing: true, brut: texte };
  }

  return Response.json(resultat);
}
