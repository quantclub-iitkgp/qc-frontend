#!/usr/bin/env node
// Delete the throwaway SoQ load-test users (and their soq_progress rows) created by
// seed-users.mjs. Matches every auth user whose email starts with EMAIL_PREFIX.
//
// Order matters: progress rows are deleted first in case soq_progress.user_id has no
// ON DELETE CASCADE (otherwise the user delete would be blocked by the FK).
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... node cleanup-users.mjs
//
// Requires Node 18+ (global fetch).

const SUPABASE_URL = requireEnv("SUPABASE_URL").replace(/\/$/, "")
const SERVICE_ROLE = requireEnv("SUPABASE_SERVICE_ROLE_KEY")
const EMAIL_PREFIX = process.env.EMAIL_PREFIX ?? "loadtest+"
const PER_PAGE = 1000

function requireEnv(name) {
  const v = process.env[name]
  if (!v) {
    console.error(`Missing required env var: ${name}`)
    process.exit(1)
  }
  return v
}

const adminHeaders = {
  apikey: SERVICE_ROLE,
  Authorization: `Bearer ${SERVICE_ROLE}`,
  "Content-Type": "application/json",
}

async function listMatchingUsers() {
  const matches = []
  for (let page = 1; ; page++) {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${PER_PAGE}`,
      { headers: adminHeaders },
    )
    if (!res.ok) throw new Error(`list users failed: HTTP ${res.status} ${await res.text()}`)
    const body = await res.json()
    const users = Array.isArray(body) ? body : body.users || []
    for (const u of users) {
      if (u.email && u.email.startsWith(EMAIL_PREFIX)) matches.push(u.id)
    }
    if (users.length < PER_PAGE) break
  }
  return matches
}

async function deleteProgress(userIds) {
  // Batch the IN(...) filter to keep the URL a sane length.
  for (let i = 0; i < userIds.length; i += 50) {
    const batch = userIds.slice(i, i + 50)
    const inList = batch.map((id) => `"${id}"`).join(",")
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/soq_progress?user_id=in.(${inList})`,
      { method: "DELETE", headers: { ...adminHeaders, Prefer: "return=minimal" } },
    )
    if (!res.ok && res.status !== 404) {
      console.warn(`  progress delete batch failed: HTTP ${res.status} ${await res.text()}`)
    }
  }
}

async function deleteUser(id) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: adminHeaders,
  })
  if (!res.ok) throw new Error(`delete ${id} failed: HTTP ${res.status} ${await res.text()}`)
}

async function main() {
  console.log(`Finding users with email prefix "${EMAIL_PREFIX}" ...`)
  const ids = await listMatchingUsers()
  if (ids.length === 0) {
    console.log("No matching test users found. Nothing to do.")
    return
  }
  console.log(`Found ${ids.length}. Deleting their soq_progress rows ...`)
  await deleteProgress(ids)
  console.log(`Deleting ${ids.length} users ...`)
  let done = 0
  for (const id of ids) {
    await deleteUser(id)
    if (++done % 25 === 0) console.log(`  ...${done}/${ids.length}`)
  }
  console.log(`Done. Removed ${ids.length} test users.`)
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
