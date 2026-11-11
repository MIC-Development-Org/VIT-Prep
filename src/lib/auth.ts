import 'server-only';
import { auth } from '@/auth';

export async function getAuthenticatedUser(_request?: Request): Promise<string | null> {
  void _request;
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user.id || session.user.email || null;
}

export async function getAuthenticatedSession() {
  return await auth();
}
