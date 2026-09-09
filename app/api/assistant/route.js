import { createClient } from '@supabase/supabase-js';

// POST /api/assistant
// Reçoit { message, access_token } et répond en s'appuyant sur les données
// réelles du travailleur connecté (via son propre token, donc RLS respectée).
export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ erreur: "GEMINI_API_KEY n'est pas encore configurée sur Vercel." }, { status: 501 });
  }

  const { message, access_token } = await request.json();
  if (!message || !access_token) {
    return Response.json({ erreur: 'message et access_token requis' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${access_token}` } } }
  );

  const { data: userData, error: authError } = await supabase.auth.getUser(access_token);
  if (authError || !userData?.user) {
    return Response.json({ erreur: 'Session invalide' }, { status: 401 });
  }
  const uid = userData.user.id;

  const [{ data: profil }, { data: credit }, { data: abonnement }, { data: transactions }] = await Promise.all([
    supabase.from('utilisateurs').select('nom, prenom, statut').eq('id', uid).single(),
    supabase.from('credits').select('plafond, montant_utilise, montant_du, montant_rembourse').eq('travailleur_id', uid).maybeSingle(),
    supabase.from('abonnements').select('statut, date_expiration').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('transactions').select('montant_total, statut, created_at').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(5),
  ]);

  const contexte = `
Données réelles du travailleur connecté (à utiliser pour répondre) :
- Nom : ${profil?.prenom || ''} ${profil?.nom || ''}
- Statut du compte : ${profil?.statut || 'inconnu'}
- Abonnement : ${abonnement?.statut || 'aucun'}${abonnement?.date_expiration ? ', expire le ' + abonnement.date_expiration : ''}
- Crédit : plafond ${credit?.plafond ?? 0} FCFA, utilisé ${credit?.montant_utilise ?? 0} FCFA, disponible ${credit ? credit.plafond - credit.montant_utilise : 0} FCFA
- Dette en cours : ${credit?.montant_du ?? 0} FCFA (déjà remboursé : ${credit?.montant_rembourse ?? 0} FCFA)
- Dernières transactions : ${transactions?.length ? transactions.map(t => `${t.montant_total} FCFA (${t.statut})`).join(', ') : 'aucune'}
`;

  const systemPrompt = `Tu es l'assistant intégré de BIG BLU PHARMA PASS, une plateforme d'accès des travailleurs
aux médicaments via des pharmacies partenaires. Tu réponds UNIQUEMENT aux questions sur le fonctionnement
de la plateforme : crédit, abonnement, recherche de pharmacies, transactions, reçus, indications, remboursements.
Tu utilises les données réelles fournies ci-dessous pour répondre précisément.
Tu n'es PAS un pharmacien et tu ne donnes JAMAIS de conseil médical, de posologie, ni d'avis sur un médicament :
pour toute question médicale, tu réponds qu'il faut s'adresser à un pharmacien ou un médecin.
Réponds en français, de façon brève et directe (2-4 phrases maximum).

${contexte}

Question du travailleur : ${message}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    return Response.json({ erreur: 'Erreur Gemini', detail }, { status: 502 });
  }

  const data = await response.json();
  const texte = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu répondre, réessaie.";

  return Response.json({ reponse: texte });
}
