import 'server-only';

export async function getAuthenticatedUser(_request: Request): Promise<string | null> {
  // The authentication integration should return the verified, stable user ID here.
  void _request;
  return null;
}
