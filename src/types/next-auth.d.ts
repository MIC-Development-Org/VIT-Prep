import { UserRole } from '@/types';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: UserRole;
    regNo?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      regNo?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    regNo?: string;
  }
}

