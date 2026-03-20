import Link from "next/link"
import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnrollmentGate() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-5">
      <Card className="border-4 border-border shadow-shadow max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
              <Lock className="h-7 w-7 text-main-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl font-heading">Enrollment Required</CardTitle>
          <CardDescription className="text-foreground/60">
            This content is for enrolled SoQ participants. Sign up for an account, then wait for enrollment confirmation from the Quant Club team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/soq/signup">
            <Button className="w-full">Create Account</Button>
          </Link>
          <Link href="/soq/login">
            <Button variant="neutral" className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
