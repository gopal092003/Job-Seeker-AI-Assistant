// src/components/auth/login-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { GoogleButton } from "@/components/auth/google-button";

import { supabase } from "@/lib/supabase/client";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      successToast("Logged in successfully");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4"
    >
      <Input
        type="email"
        value={email}
        placeholder="Email Address"
        onChange={(e) =>
          setEmail(e.target.value)
        }
        required
      />

      <Input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleButton />
    </form>
  );
}