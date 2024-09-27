'use client'; 

import { signInWithGoogleAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import React from 'react';

interface GoogleSignUpButtonProps {
  returnTo?: string;
}

interface GoogleSignInButtonProps {
  returnTo?: string;
}

export function GoogleSignInButton({ returnTo }: GoogleSignInButtonProps) {
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

export function GoogleSignUpButton({ returnTo }: GoogleSignUpButtonProps) {
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