'use client';

import { signInWithGoogleAction } from "@/app/actions";
import { Button, ButtonProps } from "@/components/ui/button";
import React from 'react';

interface GoogleSignInButtonProps extends ButtonProps {
  returnTo?: string;
}

export function GoogleSignInButton({ returnTo, className, ...props }: GoogleSignInButtonProps) {
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
      className={className}
      {...props}
    >
      Sign In With Google
    </Button>
  );
}