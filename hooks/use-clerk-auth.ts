import { useUser, useAuth, useSignIn, useSignUp } from "@clerk/nextjs"

export function useClerkAuth() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useAuth()
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()

  return {
    // User data
    user,
    isLoaded,
    isSignedIn,
    
    // Authentication functions
    signIn,
    signUp,
    signOut,
    
    // Loading states
    signInLoaded,
    signUpLoaded,
    
    // Helper functions
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    
    // User profile data
    userId: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
  }
}
