"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth")
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded) {
    return <>{fallback}</>
  }

  if (!isSignedIn) {
    return null
  }

  return <>{children}</>
}
