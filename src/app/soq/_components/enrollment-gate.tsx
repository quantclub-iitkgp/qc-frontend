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
            This content is available to enrolled SoQ participants only. Apply for the program to get access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/soq">
            <Button className="w-full">View Program Details</Button>
          </Link>
          <Link href="/soq/login">
            <Button variant="neutral" className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
