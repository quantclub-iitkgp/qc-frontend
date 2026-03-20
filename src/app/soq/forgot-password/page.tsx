"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, TrendingUp, ArrowLeft, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/soq/login`,
    })
    if (error) {
      setServerError(error.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="min-h-dvh pt-[70px] bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow mb-4">
            <TrendingUp className="h-7 w-7 text-main-foreground" />
          </div>
          <h1 className="text-2xl font-heading">Summer of Quant</h1>
          <p className="text-foreground/50 text-sm mt-1">Quant Club IIT Kharagpur</p>
        </div>

        <Card className="border-4 border-border shadow-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Reset your password</CardTitle>
            <CardDescription className="text-foreground/60">
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                  <h3 className="text-xl font-heading">Check your email</h3>
                  <p className="text-sm text-foreground/60 max-w-xs">
                    If an account exists for that email, you&apos;ll receive a password reset link shortly.
                  </p>
                  <Link href="/soq/login">
                    <Button variant="neutral" className="mt-2">Back to Sign In</Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 font-heading">
                      <Mail className="h-4 w-4" /> Email
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

                  {serverError && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-base px-3 py-2">
                      {serverError}
                    </p>
                  )}

                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          {!done && (
            <CardFooter className="flex justify-center border-t-2 border-border/40 pt-4">
              <Link
                href="/soq/login"
                className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
