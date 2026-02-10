import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { IS_DEMO, DEMO_TENANT_ID } from "@/lib/constants/app";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: IS_DEMO ? undefined : (PrismaAdapter(db) as ReturnType<typeof PrismaAdapter>),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (IS_DEMO) {
          return {
            id: "demo-user-001",
            name: "Demo User",
            email: "demo@proofdesk.ai",
            image: null,
          };
        }

        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        // In production, use bcrypt.compare(credentials.password, user.passwordHash)
        // For now, simple comparison for development
        const { compare } = await import("./password");
        const valid = await compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (IS_DEMO) {
        token.orgId = DEMO_TENANT_ID;
        token.orgRole = "OWNER";
        return token;
      }

      if (token.id && !token.orgId) {
        const membership = await db.membership.findFirst({
          where: { userId: token.id as string },
          include: { organization: true },
          orderBy: { createdAt: "asc" },
        });
        if (membership) {
          token.orgId = membership.organizationId;
          token.orgRole = membership.role;
          token.orgName = membership.organization.name;
          token.orgSlug = membership.organization.slug;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      const s = session as unknown as Record<string, unknown>;
      s.orgId = token.orgId;
      s.orgRole = token.orgRole;
      s.orgName = token.orgName;
      s.orgSlug = token.orgSlug;
      return session;
    },
  },
});
