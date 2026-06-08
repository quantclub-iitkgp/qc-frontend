"use client"

import { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { UserPlus, Mail, Lock, TrendingUp } from "lucide-react"
import { Github } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
type FormValues = z.infer<typeof schema>

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/soq"
  const [serverError, setServerError] = useState<string | null>(null)
  const [githubLoading, setGithubLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })
    if (error) {
      setServerError(error.message)
      return
    }
    // With "Confirm email" disabled, signUp returns a live session and the user is
    // logged in immediately. If confirmation is still enabled (no session yet), fall
    // back to an explicit password sign-in so the flow never dead-ends on an email.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (signInError) {
        setServerError(signInError.message)
        return
      }
    }
    router.push(next)
    router.refresh()
  }

  async function handleGithubSignup() {
    setGithubLoading(true)
    setServerError(null)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    })
    if (error) {
      setServerError(error.message)
      setGithubLoading(false)
    }
    // On success, the browser is redirected to GitHub — no further action needed here
  }

  return (
    <div className="min-h-dvh pt-[70px] bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow mb-4">
            <TrendingUp className="h-7 w-7 text-main-foreground" />
          </div>
          <h1 className="text-2xl font-heading">Summer of Quant</h1>
          <p className="text-foreground/50 text-sm mt-1">Quant Club IIT Kharagpur</p>
        </div>

        <Card className="border-4 border-border shadow-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Create your account</CardTitle>
            <CardDescription className="text-foreground/60">
              Sign up to access the Summer of Quant program
            </CardDescription>
          </CardHeader>

          <CardContent>
            <motion.form
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
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 font-heading">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 font-heading">
                      <Lock className="h-4 w-4" /> Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  {serverError && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-base px-3 py-2">
                      {serverError}
                    </p>
                  )}

                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting || githubLoading}>
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
            </motion.form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-foreground/40 font-heading">or</span>
              </div>
            </div>

            {/* GitHub OAuth */}
            <Button
              type="button"
              variant="neutral"
              className="w-full font-heading"
              onClick={handleGithubSignup}
              disabled={isSubmitting || githubLoading}
            >
              {githubLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Connecting to GitHub...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t-2 border-border/40 pt-4">
            <p className="text-sm text-foreground/60">
              Already have an account?{" "}
              <Link href={`/soq/login${next !== "/soq" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-heading text-foreground underline underline-offset-2 hover:text-main transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SoQSignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
