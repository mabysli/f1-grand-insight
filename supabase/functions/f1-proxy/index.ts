import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const BASE = 'https://v1.formula-1.api-sports.io'
const TTL_MS = 6 * 60 * 60 * 1000 // 6 horas

const ROUTES: Record<string, string> = {
  races: '/races',
  'rankings-drivers': '/rankings/drivers',
  'rankings-teams': '/rankings/teams',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const url = new URL(req.url)
    let endpoint = url.searchParams.get('endpoint') ?? ''
    let season = url.searchParams.get('season') ?? ''

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      endpoint = body.endpoint ?? endpoint
      season = String(body.season ?? season)
    }

    if (!ROUTES[endpoint]) {
      return json({ error: 'invalid endpoint' }, 400)
    }
    if (!/^\d{4}$/.test(season)) {
      return json({ error: 'invalid season' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const cacheKey = `${endpoint}:${season}`
    const { data: cached } = await supabase
      .from('f1_api_cache')
      .select('data, fetched_at')
      .eq('cache_key', cacheKey)
      .maybeSingle()

    if (cached && Date.now() - new Date(cached.fetched_at).getTime() < TTL_MS) {
      return json({ data: cached.data, cached: true })
    }

    try {
      const res = await fetch(`${BASE}${ROUTES[endpoint]}?season=${season}`, {
        headers: { 'x-apisports-key': Deno.env.get('F1_API_SPORTS_KEY')! },
      })
      if (!res.ok) throw new Error(`api-sports ${res.status}`)
      const payload = await res.json()

      const errors = payload?.errors
      const hasErrors = Array.isArray(errors) ? errors.length > 0 : errors && Object.keys(errors).length > 0
      if (hasErrors && (!payload.response || payload.response.length === 0)) {
        throw new Error(JSON.stringify(errors))
      }

      const data = payload.response ?? []
      await supabase
        .from('f1_api_cache')
        .upsert({ cache_key: cacheKey, data, fetched_at: new Date().toISOString() })

      return json({ data, cached: false })
    } catch (err) {
      if (cached) {
        return json({ data: cached.data, cached: true, stale: true })
      }
      return json({ error: String(err), data: [] }, 200)
    }
  } catch (err) {
    return json({ error: String(err), data: [] }, 500)
  }
})
