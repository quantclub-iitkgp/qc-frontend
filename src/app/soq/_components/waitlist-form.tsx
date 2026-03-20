"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle, User, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitWaitlistAction } from "../actions"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[+\d\s\-()]+$/, "Enter a valid phone number"),
})

type FormValues = z.infer<typeof schema>

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const result = await submitWaitlistAction(values)
    if ("error" in result) {
      setServerError(result.error)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow"
          >
            <CheckCircle className="h-8 w-8 text-main-foreground" />
          </motion.div>
          <h3 className="text-2xl font-heading">You&apos;re on the list!</h3>
          <p className="text-foreground/60 max-w-xs">
            We&apos;ll reach out when applications open for Summer of Quant 2026. Stay sharp.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 font-heading">
              <User className="h-4 w-4" /> Full Name
            </Label>
            <Input
              id="name"
              placeholder="Arjun Sharma"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 font-heading">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="arjun@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 font-heading">
              <Phone className="h-4 w-4" /> Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-base px-3 py-2">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
                Joining...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Join the Waitlist
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
