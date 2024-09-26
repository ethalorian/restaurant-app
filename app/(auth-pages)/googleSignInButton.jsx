'use client'; 

import { signInWithGoogleAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogleAction();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle the error appropriately
    }
  };

  return (
        <Button
          onClick={handleGoogleSignIn}
        >
          Sign In With Google
        </Button>
  );
}

export function GoogleSignUpButton() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogleAction();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle the error appropriately
    }
  };

  return (
        <Button
          onClick={handleGoogleSignIn}
        >
          Sign Up With Google
        </Button>
  );
}