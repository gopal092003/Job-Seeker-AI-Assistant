// src/app/(auth)/login/page.tsx

import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Sign In
          </h1>

          <p className="text-sm text-muted-foreground">
            Access your job search dashboard
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Don't have an account?{" "}
          </span>

          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}