#!/usr/bin/env node
// Seed a pool of throwaway SoQ test users for the load test.
//
// Creates POOL_SIZE users via the Supabase Admin API (email_confirm=true so they can log
// in immediately — SoQ has email confirmation off anyway) and writes their credentials to
// users.json, which the k6 script logs in during setup() and reuses as bearer tokens.
//
// All emails share a tag prefix (EMAIL_PREFIX, default "loadtest+") so cleanup-users.mjs can
// find and delete them afterwards. Re-running is safe: existing users (HTTP 422) are kept.
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   POOL_SIZE=50 node seed-users.mjs
//
// Requires Node 18+ (global fetch). No npm install needed.

import { writeFileSync } from "node:fs"

const SUPABASE_URL = requireEnv("SUPABASE_URL").replace(/\/$/, "")
const SERVICE_ROLE = requireEnv("SUPABASE_SERVICE_ROLE_KEY")
const POOL_SIZE = Number(process.env.POOL_SIZE ?? 50)
const PASSWORD = process.env.TEST_PASSWORD ?? "Loadtest!2000"
const EMAIL_PREFIX = process.env.EMAIL_PREFIX ?? "loadtest+"
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN ?? "example.com"
const OUT = process.env.POOL_FILE ?? new URL("./users.json", import.meta.url).pathname

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

async function createUser(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({ email, password: PASSWORD, email_confirm: true }),
  })
  if (res.ok) return "created"
  // 422 = already registered; treat as fine so re-runs are idempotent.
  const body = await res.text()
  if (res.status === 422 || /already been registered|already exists/i.test(body)) return "exists"
  throw new Error(`create ${email} failed: HTTP ${res.status} ${body}`)
}

async function main() {
  console.log(`Seeding ${POOL_SIZE} test users at ${SUPABASE_URL} ...`)
  const users = []
  let created = 0
  let existed = 0
  for (let i = 0; i < POOL_SIZE; i++) {
    const email = `${EMAIL_PREFIX}${i}@${EMAIL_DOMAIN}`
    const status = await createUser(email)
    status === "created" ? created++ : existed++
    users.push({ email, password: PASSWORD })
    if ((i + 1) % 25 === 0) console.log(`  ...${i + 1}/${POOL_SIZE}`)
  }
  writeFileSync(OUT, JSON.stringify(users, null, 2))
  console.log(`Done. created=${created} alreadyExisted=${existed}`)
  console.log(`Wrote ${users.length} credentials -> ${OUT}`)
  console.log(`Cleanup later with: node cleanup-users.mjs`)
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
