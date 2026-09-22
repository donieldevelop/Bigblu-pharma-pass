import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function genererMotDePasseTemporaire() {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let mdp = '';
  for (let i = 0; i < 10; i++) {
    mdp += caracteres[Math.floor(Math.random() * caracteres.length)];
  }
  return mdp;
}

export async function POST(request) {
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "Clé service_role non configurée côté serveur." }, { status: 501 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const accessToken = authHeader.replace('Bearer ', '').trim();
  if (!accessToken) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Identifier l'agent à partir de son token de session
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
  }
  const agentId = userData.user.id;

  const { data: agentRow, error: agentError } = await supabaseAdmin
    .from('utilisateurs')
    .select('id, role, statut')
    .eq('id', agentId)
    .single();

  if (agentError || !agentRow || agentRow.role !== 'commercial') {
    return NextResponse.json({ error: 'Accès refusé : réservé aux agents commerciaux.' }, { status: 403 });
  }

  const body = await request.json();
  const { nom, prenom, telephone, email, entreprise } = body || {};

  if (!nom || !prenom || !telephone || !email) {
    return NextResponse.json({ error: 'Nom, prénom, téléphone et e-mail sont obligatoires.' }, { status: 400 });
  }

  const motDePasseTemporaire = genererMotDePasseTemporaire();

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: motDePasseTemporaire,
    email_confirm: true,
    user_metadata: {
      role: 'travailleur',
      nom,
      prenom,
      telephone,
      cree_par_agent_id: agentId,
    },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const nouveauId = created.user.id;

  // Si une entreprise est renseignée, on la note dans les infos complémentaires du profil
  if (entreprise) {
    await supabaseAdmin
      .from('profils_travailleur')
      .update({ informations_complementaires: { entreprise } })
      .eq('user_id', nouveauId);
  }

  // Récupérer le code client généré par le trigger pour le renvoyer à l'agent
  const { data: nouveauUtilisateur } = await supabaseAdmin
    .from('utilisateurs')
    .select('code_client')
    .eq('id', nouveauId)
    .single();

  return NextResponse.json({
    ok: true,
    id: nouveauId,
    code_client: nouveauUtilisateur?.code_client || null,
    email,
    mot_de_passe_temporaire: motDePasseTemporaire,
  });
}
