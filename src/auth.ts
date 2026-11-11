import NextAuth from 'next-auth';
import {
  authConfig,
  isVitInstitutionalEmail,
  determineUserRole,
  extractRegNoFromEmail,
} from './auth.config';

export { isVitInstitutionalEmail, determineUserRole, extractRegNoFromEmail };

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'vitprep-auth-secret-ay-2026-27',
  trustHost: true,
  ...authConfig,
});
