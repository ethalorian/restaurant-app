'use client';

import { useEffect } from 'react';

export default function GoogleSignInButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="35925782775-60h4fpf6eml3v06b19276jnb5umov7ba.apps.googleusercontent.com"
        data-context="signup"
        data-ux_mode="popup"
        data-login_uri="https://vjbicbyggcrdejrwwzqn.supabase.co/auth/v1/callback"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_black"
        data-text="signup_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}