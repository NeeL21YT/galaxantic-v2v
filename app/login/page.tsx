/**
 * app/login/page.tsx
 *
 * Login page - wired to Supabase Auth via signIn server action.
 * The signIn action redirects to /dashboard on success; errors are
 * displayed inline using the Toast component.
 *
 * useSearchParams() is isolated inside LoginForm which is wrapped in
 * <Suspense> to satisfy Next.js 16's static analysis requirements.
 */

import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Herizon account to continue your journey."
      illustration={<Sparkles className="w-16 h-16" />}
      tagline="Every great comeback starts with a single step forward."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
