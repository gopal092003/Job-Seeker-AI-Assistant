// src/components/auth/google-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { errorToast } from "@/hooks/use-toast";

export function GoogleButton() {
  const handleGoogleLogin = async () => {
    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/callback`,
          },
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google",
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full"
    >
      Continue with Google
    </Button>
  );
}