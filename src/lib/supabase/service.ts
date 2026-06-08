import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Service-role client for server-only, RLS-bypassing reads of public-but-login-gated content
// (currently just SoQ topic bodies cached globally — see soq-api.ts). It does NOT widen who
// can see the data: access is still gated by middleware, which requires login for the entire
// /soq area. The service role is used purely so the cross-request cache can fetch the body
// without a per-user cookie/session (unstable_cache cannot read cookies).
//
// NEVER import this from a Client Component — the service role key is server-only
// (SUPABASE_SERVICE_ROLE_KEY, not NEXT_PUBLIC) and would leak into the browser bundle.
let _serviceClient: SupabaseClient | null = null

export function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for server-side cached SoQ content reads",
      )
    }
    _serviceClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _serviceClient
}
