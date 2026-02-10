"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { createClientSchema, type CreateClientInput } from "@/lib/validation/schemas";
import { ROUTES } from "@/lib/constants/app";
import { apiClient } from "@/lib/api/client";

export default function NewClientPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
  });

  const onSubmit = async (data: CreateClientInput) => {
    try {
      await apiClient.post("/api/clients", data);
      toast.success("Client created successfully");
      router.push(ROUTES.CLIENTS);
    } catch {
      toast.error("Failed to create client. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-fade-in-up">
        <Link
          href={ROUTES.CLIENTS}
          className="rounded-[var(--radius-md)] p-1.5 text-text-muted hover:bg-bg-subtle hover:text-text transition-colors"
          aria-label="Back to clients"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">New Client</h1>
          <p className="text-sm text-text-muted mt-0.5">Add a new client to your organization</p>
        </div>
      </div>

      <Card className="glow-card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Client Name"
              placeholder="e.g. Acme Corp"
              error={errors.name?.message}
              {...register("name")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Name"
                placeholder="e.g. Jane Smith"
                error={errors.contactName?.message}
                {...register("contactName")}
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="e.g. jane@acme.com"
                error={errors.contactEmail?.message}
                {...register("contactEmail")}
              />
            </div>
            <Input
              label="Industry"
              placeholder="e.g. Technology, Finance, Healthcare"
              error={errors.industry?.message}
              {...register("industry")}
            />
            <Textarea
              label="Notes"
              placeholder="Any additional notes about this client..."
              error={errors.notes?.message}
              {...register("notes")}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Link href={ROUTES.CLIENTS}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={isSubmitting}>
              Create Client
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
