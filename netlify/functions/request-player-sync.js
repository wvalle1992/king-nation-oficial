function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function getBearerToken(request) {
  const authorizationHeader = request.headers.get('authorization') || '';

  if (!authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length).trim();
}

async function fetchSupabaseUser({ supabaseUrl, anonKey, accessToken }) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function fetchPlayerByDiscordUserId({ supabaseUrl, serviceRoleKey, providerId }) {
  const query = new URLSearchParams({
    select: 'discord_user_id,role,vip_status',
    discord_user_id: `eq.${providerId}`
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/players?${query.toString()}`, {
    method: 'GET',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar la tabla players.');
  }

  const players = await response.json();
  return Array.isArray(players) ? players[0] || null : null;
}

export default async requestPlayerSync(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, { status: 405 });
  }

  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return jsonResponse({ error: 'Token no proporcionado' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Configuración incompleta del servidor' }, { status: 500 });
  }

  const user = await fetchSupabaseUser({
    supabaseUrl,
    anonKey,
    accessToken
  });

  if (!user) {
    return jsonResponse({ error: 'No autorizado' }, { status: 401 });
  }

  const providerId = user?.user_metadata?.provider_id;

  if (!providerId) {
    return jsonResponse({ error: 'No autorizado' }, { status: 403 });
  }

  const player = await fetchPlayerByDiscordUserId({
    supabaseUrl,
    serviceRoleKey,
    providerId
  });

  const isOwner = providerId === '1219039567798079540';
  const isDecano = player?.role === 'ELDER';

  if (!(isDecano || isOwner)) {
    return jsonResponse({ error: 'No autorizado' }, { status: 403 });
  }

  return jsonResponse({
    success: true,
    message: 'Autorizado para sincronizar'
  });
}
