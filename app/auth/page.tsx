"use client"

import { SignIn, SignUp } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to PhoolSeFayda
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-6">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-green-600 hover:bg-green-700",
                  card: "shadow-lg",
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-6">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-green-600 hover:bg-green-700",
                  card: "shadow-lg",
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
