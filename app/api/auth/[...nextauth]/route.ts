import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

const authOptions: NextAuthOptions = {
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
      if (!allowed.includes(email)) {
        console.warn(`[auth] Blocked login attempt: ${email}`);
        return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/'))     return `${baseUrl}${url}`;
      return `${baseUrl}/admin`;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
