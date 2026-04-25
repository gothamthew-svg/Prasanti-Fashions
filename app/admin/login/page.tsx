'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginContent() {
  const { data: session, status } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const error        = searchParams.get('error');

  useEffect(() => {
    if (status === 'authenticated') router.push('/admin');
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#2e0404' }}>
      <div className="w-full max-w-md">
        <div style={{ background: '#fdf6ec', border: '1px solid #f0d48a', padding: '40px', textAlign: 'center' }}>
          <div style={{ color: '#d4a017', fontSize: '32px', marginBottom: '16px' }}>✦</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#4a0707', marginBottom: '4px' }}>
            Pra Fashions
          </h1>
          <p style={{ fontFamily: 'sans-serif', fontSize: '11px', color: '#b8860b', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px' }}>
            Admin Portal
          </p>

          {error === 'AccessDenied' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px', marginBottom: '20px', fontSize: '13px', textAlign: 'left' }}>
              <strong>Access denied.</strong> Your Google account is not on the admin list. Contact the site owner.
            </div>
          )}

          {error && error !== 'AccessDenied' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px', marginBottom: '20px', fontSize: '13px' }}>
              An error occurred. Please try again.
            </div>
          )}

          <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
            Sign in with your Google account to access the admin dashboard. Only authorised team members can log in.
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', background: 'white', border: '1px solid #e5e7eb',
              padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              fontFamily: 'sans-serif', fontWeight: 'bold', color: '#374151',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#d1d5db')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ fontFamily: 'sans-serif', fontSize: '11px', color: '#999', marginTop: '20px' }}>
            Secure login · Session expires after 8 hours
          </p>
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'sans-serif', fontSize: '11px', color: '#ffffff33', marginTop: '20px' }}>
          © {new Date().getFullYear()} Pra Fashions LLC
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#2e0404' }} />}>
      <LoginContent />
    </Suspense>
  );
}
