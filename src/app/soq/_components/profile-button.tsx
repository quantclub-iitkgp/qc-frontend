"use client"

import { useState, useTransition, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { User, Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { upsertUserProfileAction } from "../actions"
import type { UserProfile } from "@/lib/soq-api"

// Which fields count toward "profile complete"
const PROFILE_FIELDS: (keyof Omit<UserProfile, "id">)[] = [
  "fullName",
  "university",
  "email",
  "phone",
  "gender",
]

function countFilled(profile: Omit<UserProfile, "id">): number {
  return PROFILE_FIELDS.filter((f) => {
    const v = profile[f]
    return v !== null && v !== undefined && String(v).trim() !== ""
  }).length
}

// ---------------------------------------------------------------------------
// Animated profile button
// ---------------------------------------------------------------------------

interface ProfileButtonProps {
  initialProfile: Omit<UserProfile, "id"> | null
}

export function ProfileButton({ initialProfile }: ProfileButtonProps) {
  const reduce = useReducedMotion()

  const emptyProfile: Omit<UserProfile, "id"> = {
    fullName: null,
    university: null,
    email: null,
    phone: null,
    gender: null,
  }

  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<Omit<UserProfile, "id">>(
    initialProfile ?? emptyProfile,
  )

  const filled = countFilled(profile)
  const total = PROFILE_FIELDS.length
  const isComplete = filled === total
  const pct = Math.round((filled / total) * 100)

  // Animate label between "Profile" and progress bar
  const [showProgress, setShowProgress] = useState(!isComplete)

  useEffect(() => {
    if (isComplete) {
      setShowProgress(false)
      return
    }
    // Alternate every 2.5 s between text and progress indicator
    const id = setInterval(() => setShowProgress((p) => !p), 2500)
    return () => clearInterval(id)
  }, [isComplete])

  return (
    <>
      <Button
        id="soq-profile-btn"
        variant="neutral"
        size="sm"
        onClick={() => setOpen(true)}
        className="relative overflow-hidden min-w-[90px] h-9"
        aria-label="Edit your profile"
      >
        <AnimatePresence mode="wait" initial={false}>
          {showProgress && !isComplete ? (
            <motion.div
              key="progress"
              className="flex items-center gap-2 w-full"
              initial={reduce ? {} : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {/* mini progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full bg-main rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-heading tabular-nums text-foreground/70">
                {filled}/{total}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="label"
              className="flex items-center gap-1.5"
              initial={reduce ? {} : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
              {isComplete && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-main text-main-foreground">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <ProfileModal
        open={open}
        onClose={() => setOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Profile modal
// ---------------------------------------------------------------------------

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  profile: Omit<UserProfile, "id">
  onSave: (updated: Omit<UserProfile, "id">) => void
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const

function ProfileModal({ open, onClose, profile, onSave }: ProfileModalProps) {
  const [form, setForm] = useState(profile)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Sync form when parent profile changes (e.g. on open)
  useEffect(() => {
    if (open) {
      setForm(profile)
      setError(null)
      setSaved(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const filled = countFilled(form)
  const total = PROFILE_FIELDS.length
  const pct = Math.round((filled / total) * 100)

  function set(key: keyof Omit<UserProfile, "id">, value: string) {
    setForm((prev) => ({ ...prev, [key]: value.trim() === "" ? null : value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await upsertUserProfileAction(form)
      if (result.error) {
        setError(result.error)
      } else {
        setSaved(true)
        onSave(form)
        setTimeout(() => {
          setSaved(false)
          onClose()
        }, 900)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow">
              <User className="h-4 w-4 text-main-foreground" />
            </div>
            Your Profile
          </DialogTitle>
          <DialogDescription>
            Fill in your details to personalise your SoQ experience and appear on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar inside modal */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground/50">Profile completion</span>
            <span className="text-xs font-heading tabular-nums text-foreground/70">
              {filled}/{total} filled
            </span>
          </div>
          <div className="h-2 w-full rounded-base border-2 border-border bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-main rounded-base"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-1">
          {/* Full name */}
          <div className="space-y-1">
            <label htmlFor="profile-name" className="text-sm font-heading">
              Full name
            </label>
            <Input
              id="profile-name"
              placeholder="Ada Lovelace"
              value={form.fullName ?? ""}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </div>

          {/* University */}
          <div className="space-y-1">
            <label htmlFor="profile-university" className="text-sm font-heading">
              University / Institution
            </label>
            <Input
              id="profile-university"
              placeholder="IIT Kharagpur"
              value={form.university ?? ""}
              onChange={(e) => set("university", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="profile-email" className="text-sm font-heading">
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              placeholder="ada@example.com"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="profile-phone" className="text-sm font-heading">
              Phone
            </label>
            <Input
              id="profile-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <span className="text-sm font-heading block">Gender</span>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const active = form.gender === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("gender", opt.value)}
                    className={`px-3 py-2 text-xs font-heading rounded-base border-2 transition-all ${
                      active
                        ? "border-border bg-main text-main-foreground shadow-shadow"
                        : "border-border bg-secondary-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <X className="h-3 w-3" /> {error}
            </p>
          )}

          <div className="flex justify-end pt-1">
            <Button
              id="profile-save-btn"
              type="submit"
              size="sm"
              disabled={isPending || saved}
              className="min-w-[90px]"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved!
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
