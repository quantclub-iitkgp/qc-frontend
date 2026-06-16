"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, KeyRound, CheckCircle, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  userEmail: string | null
}

export function SettingsModal({ open, onClose, userEmail }: SettingsModalProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset()
      setServerError(null)
      setSuccess(false)
      onClose()
    }
  }

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const supabase = createClient()

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.newPassword,
    })

    if (updateError) {
      setServerError(updateError.message || "Failed to update password.")
      return
    }

    setSuccess(true)
    setTimeout(() => {
      handleOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow">
              <Settings className="h-4 w-4 text-main-foreground" />
            </div>
            Account Settings
          </DialogTitle>
          <DialogDescription>
            Enter a new password below to secure your account.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="flex h-14 w-14 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow"
              >
                <CheckCircle className="h-7 w-7 text-main-foreground" />
              </motion.div>
              <h3 className="text-xl font-heading">Password Updated!</h3>
              <p className="text-sm text-foreground/60 max-w-xs">
                Your new password has been set successfully.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="flex items-center gap-2 font-heading">
                  <KeyRound className="h-3.5 w-3.5" /> New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Min. 8 characters"
                  {...register("newPassword")}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 font-heading">
                  <KeyRound className="h-3.5 w-3.5" /> Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {serverError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-base px-3 py-2 flex items-start gap-1">
                  <X className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </p>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
