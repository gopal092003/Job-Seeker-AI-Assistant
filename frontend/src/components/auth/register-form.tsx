// src/components/auth/register-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { profileSchema } from "@/lib/validators/profile";
import { supabase } from "@/lib/supabase/client";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

export function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const validated =
        profileSchema.safeParse({
          name: username,
          email,
        });

      if (!validated.success) {
        throw new Error(
          validated.error.issues[0]?.message ??
            "Invalid input",
        );
      }

      const { error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name: username,
            },
          },
        });

      if (error) {
        throw error;
      }

      successToast(
        "Account created. Please verify your email.",
      );

      router.push("/verify-email");
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4"
    >
      <Input
        value={username}
        placeholder="User Name"
        onChange={(e) =>
          setUsername(
            e.target.value,
          )
        }
        required
      />

      <Input
        type="email"
        value={email}
        placeholder="Email Address"
        onChange={(e) =>
          setEmail(
            e.target.value,
          )
        }
        required
      />

      <Input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) =>
          setPassword(
            e.target.value,
          )
        }
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </Button>
    </form>
  );
}