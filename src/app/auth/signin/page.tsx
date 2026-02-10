"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { signInSchema, type SignInInput } from "@/lib/validation/schemas";
import { ROUTES } from "@/lib/constants/app";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg p-4 noise overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/[0.07] via-secondary/[0.03] to-transparent blur-3xl animate-hero-glow" />
        <div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-secondary/[0.04] blur-3xl animate-hero-glow" style={{ animationDelay: "-10s" }} />
      </div>

      <div className="relative w-full max-w-[400px]">
        <div className="text-center mb-8 animate-fade-in-down">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-lg)] animate-float">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-lg font-semibold text-text">
              ProofDesk <span className="text-gradient">AI</span>
            </span>
          </Link>
        </div>

        <Card className="glow-card animate-scale-in-bounce">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access ProofDesk AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" loading={isLoading} className="w-full">
                Sign In
              </Button>
              <p className="text-sm text-text-muted text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
