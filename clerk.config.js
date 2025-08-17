/** @type {import('@clerk/nextjs').ClerkConfig} */
module.exports = {
  // Configure Clerk routes
  signIn: '/auth',
  signUp: '/auth',
  afterSignIn: '/',
  afterSignUp: '/',
  
  // Optional: Configure appearance
  appearance: {
    baseTheme: 'light',
    variables: {
      colorPrimary: '#10b981', // Green color for your eco-friendly theme
      borderRadius: '0.5rem',
    },
  },
  
  // Optional: Configure user profile
  userProfile: {
    signUp: {
      formFields: [
        {
          name: 'firstName',
          label: 'First Name',
          required: true,
        },
        {
          name: 'lastName',
          label: 'Last Name',
          required: true,
        },
      ],
    },
  },
};
