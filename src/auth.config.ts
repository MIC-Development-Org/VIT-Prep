import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { UserRole } from '@/types';

export function isVitInstitutionalEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean.endsWith('@vitstudent.ac.in') || clean.endsWith('@vit.ac.in');
}

export function determineUserRole(email?: string | null): UserRole {
  if (!email) return 'student';
  const cleanEmail = email.toLowerCase().trim();

  const adminList = (process.env.ADMIN_EMAILS || 'admin@vit.ac.in')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminList.includes(cleanEmail)) {
    return 'admin';
  }

  const modList = (process.env.MODERATOR_EMAILS || 'moderator@vitstudent.ac.in,moderator@vit.ac.in')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (modList.includes(cleanEmail)) {
    return 'moderator';
  }

  return 'student';
}

export function extractRegNoFromEmail(email?: string | null): string {
  if (!email) return '';
  const match = email.match(/\b(\d{2}[a-zA-Z]{3}\d{4})\b/i);
  return match ? match[1].toUpperCase() : '';
}

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email = user?.email || profile?.email;
      // PRD FR-16: Strictly restricted to VIT institutional Google accounts (@vitstudent.ac.in and @vit.ac.in)
      // Personal Google accounts (such as @gmail.com) are strictly blocked.
      if (isVitInstitutionalEmail(email)) {
        return true;
      }
      return '/auth/error?error=AccessDenied';
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = user.role || determineUserRole(user.email);
        token.regNo = user.regNo || extractRegNoFromEmail(user.email);
      } else if (!token.role && token.email) {
        token.role = determineUserRole(token.email);
        token.regNo = extractRegNoFromEmail(token.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        session.user.role = (token.role as UserRole) || 'student';
        session.user.regNo = (token.regNo as string) || '';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

