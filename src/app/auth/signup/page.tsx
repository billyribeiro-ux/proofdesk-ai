"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { signUpSchema, type SignUpInput } from "@/lib/validation/schemas";
import { apiClient } from "@/lib/api/client";
import { ROUTES } from "@/lib/constants/app";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      await apiClient.post("/api/auth/register", data);
      toast.success("Account created! Please sign in.");
      router.push(ROUTES.SIGN_IN);
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-xl font-semibold text-text">ProofDesk AI</span>
          </Link>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Start your free trial of ProofDesk AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Full Name" placeholder="Jane Smith" autoComplete="name" error={errors.name?.message} {...register("name")} />
              <Input label="Email" type="email" placeholder="you@company.com" autoComplete="email" error={errors.email?.message} {...register("email")} />
              <Input label="Password" type="password" placeholder="••••••••" autoComplete="new-password" error={errors.password?.message} hint="Min 8 chars, 1 uppercase, 1 number" {...register("password")} />
              <Input label="Organization Name" placeholder="Acme Agency" error={errors.orgName?.message} {...register("orgName")} />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" loading={isLoading} className="w-full">Create Account</Button>
              <p className="text-sm text-text-muted text-center">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
