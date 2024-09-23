'use client'; // This line is crucial

import { signInWithGoogleAction } from "@/app/actions";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogleAction();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle the error appropriately
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="w-full bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
      Sign up With Google
    </button>
  );
}