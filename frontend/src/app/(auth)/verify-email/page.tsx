// src/app/(auth)/verify-email/page.tsx

export default function VerifyEmailPage() {
    return (
      <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-lg border p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold">
            Verify Your Email
          </h1>
  
          <p className="mb-3 text-muted-foreground">
            We've sent a verification email to the
            address you provided during registration.
          </p>
  
          <p className="mb-3 text-muted-foreground">
            Please open your inbox and click the
            verification link to activate your
            account.
          </p>
  
          <p className="text-sm text-muted-foreground">
            After verification, you can return to the
            login page and access your profile.
          </p>
        </div>
      </main>
    );
  }