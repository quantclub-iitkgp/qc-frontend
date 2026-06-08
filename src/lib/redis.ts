import { Redis } from "@upstash/redis"

// ---------------------------------------------------------------------------
// Client — initialised once (module singleton). The REST-based @upstash/redis
// client is fully Edge / serverless compatible and uses fetch under the hood.
// ---------------------------------------------------------------------------
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

let _client: Redis | null | undefined
function redis(): Redis | null {
  if (_client === undefined) _client = getRedisClient()
  return _client
}

// ---------------------------------------------------------------------------
// TTLs (seconds)
// ---------------------------------------------------------------------------
export const TTL = {
  /** Auth session – short-lived so stale sessions don't linger */
  user: 60,
  /** Per-user progress – invalidated on markTopicComplete */
  userProgress: 300,
  /** Last visited topic – same lifetime as progress */
  lastVisitedTopic: 300,
} as const

// ---------------------------------------------------------------------------
// Key builders — centralised so invalidation is consistent
// ---------------------------------------------------------------------------
export const cacheKey = {
  user: (sessionToken: string) => `soq:user:${sessionToken}`,
  userProgress: (userId: string) => `soq:progress:${userId}`,
  lastVisitedTopic: (userId: string) => `soq:last-topic:${userId}`,
}

// ---------------------------------------------------------------------------
// Generic read-through helper
// ---------------------------------------------------------------------------
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const r = redis()
  if (r) {
    try {
      const cached = await r.get<T>(key)
      if (cached !== null && cached !== undefined) return cached
    } catch {
      // Redis unavailable — fall through to live fetch
    }
  }

  const value = await fetcher()

  if (r) {
    try {
      await r.set(key, value, { ex: ttlSeconds })
    } catch {
      // Best-effort write — never block the response
    }
  }

  return value
}

// ---------------------------------------------------------------------------
// Explicit invalidation helpers — call these after writes
// ---------------------------------------------------------------------------
export async function invalidateUserProgress(userId: string): Promise<void> {
  const r = redis()
  if (!r) return
  try {
    await r.del(
      cacheKey.userProgress(userId),
      cacheKey.lastVisitedTopic(userId),
    )
  } catch {
    /* best-effort */
  }
}

export async function invalidateUser(sessionToken: string): Promise<void> {
  const r = redis()
  if (!r) return
  try {
    await r.del(cacheKey.user(sessionToken))
  } catch {
    /* best-effort */
  }
}
