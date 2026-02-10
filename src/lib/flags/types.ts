import type { Role } from "@/lib/constants/app";

/** Evaluation context passed to every flag check */
export interface FlagContext {
  organizationId?: string;
  userId?: string;
  role?: Role;
  plan?: string;
  environment?: string;
}

/** Supported flag value types */
export type FlagValue = boolean | string | number;

/** A single flag definition with its default */
export interface FlagDefinition<T extends FlagValue = FlagValue> {
  key: string;
  defaultValue: T;
  description: string;
}

/** Provider interface — swap implementations without changing call sites */
export interface FlagProvider {
  readonly name: string;
  initialize(): Promise<void>;
  evaluateBoolean(key: string, defaultValue: boolean, ctx: FlagContext): boolean;
  evaluateString(key: string, defaultValue: string, ctx: FlagContext): string;
  evaluateNumber(key: string, defaultValue: number, ctx: FlagContext): number;
  shutdown(): Promise<void>;
}
