// src/app/(auth)/register/page.tsx

import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left */}
        <div className="hidden lg:flex flex-col justify-center bg-primary px-16 text-primary-foreground">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Find Your Next Job Faster
            </h1>

            <p className="mt-6 text-lg opacity-80">
              Create your account and automate your job search workflow.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                  ✓
                </div>
                <span>Track applications in one place</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                  ✓
                </div>
                <span>Build a professional profile</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                  ✓
                </div>
                <span>Get personalized job recommendations</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                  ✓
                </div>
                <span>Automate your job search process</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">
                Create Account
              </h2>

              <p className="mt-2 text-muted-foreground">
                Start your journey today
              </p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>

              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}