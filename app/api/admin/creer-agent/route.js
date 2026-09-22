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

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
  }

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from('utilisateurs')
    .select('id, role')
    .eq('id', userData.user.id)
    .single();

  if (adminError || !adminRow || adminRow.role !== 'super_admin') {
    return NextResponse.json({ error: 'Accès refusé : réservé au super administrateur.' }, { status: 403 });
  }

  const body = await request.json();
  const { nom, prenom, telephone, email } = body || {};

  if (!nom || !prenom || !telephone || !email) {
    return NextResponse.json({ error: 'Nom, prénom, téléphone et e-mail sont obligatoires.' }, { status: 400 });
  }

  const motDePasseTemporaire = genererMotDePasseTemporaire();

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: motDePasseTemporaire,
    email_confirm: true,
    user_metadata: { role: 'commercial', nom, prenom, telephone },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  await supabaseAdmin.from('utilisateurs').update({ statut: 'actif' }).eq('id', created.user.id);

  return NextResponse.json({
    ok: true,
    id: created.user.id,
    email,
    mot_de_passe_temporaire: motDePasseTemporaire,
  });
}
