"use client"

import { Flower } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"

export default function Navigation() {
  const { isSignedIn } = useUser()

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Flower className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-800">PhoolSeFayda</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/impact" className="text-gray-600 hover:text-orange-600 transition-colors">
              Impact
            </Link>
            <Link href="/felicitation" className="text-gray-600 hover:text-orange-600 transition-colors">
              Felicitation
            </Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-orange-600 transition-colors">
              Leaderboard
            </Link>
            
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
              />
            ) : (
              <Button variant="outline" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
