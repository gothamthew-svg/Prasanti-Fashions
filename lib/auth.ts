import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },
  callbacks: {
    async signIn({ user }) {
      const email   = user.email?.toLowerCase() ?? '';
      const allowed = getAdminEmails();
      if (!allowed.includes(email)) return false;
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/'))     return `${baseUrl}${url}`;
      return `${baseUrl}/admin`;
    },
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
};

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/admin/login');
  return session;
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return session;
}
