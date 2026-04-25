import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

// Rate limiting: track submissions per IP (in-memory, resets on cold start)
// For production at scale, replace with Redis / Upstash
const submissionMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = submissionMap.get(ip);
  if (!entry || now > entry.resetAt) {
    submissionMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1hr window
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Send email via Resend (https://resend.com — free tier: 3000 emails/mo)
    // Install: already in package.json as "resend"
    // Setup: add RESEND_API_KEY to .env.local
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder');

    await resend.emails.send({
      from:    'Pra Fashions <noreply@yourdomain.com>', // Replace with your verified Resend domain
      to:      [process.env.CONTACT_EMAIL!],
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2e1a0a;">
          <div style="background: #600909; padding: 24px; text-align: center;">
            <h1 style="color: #f0d48a; margin: 0; font-size: 24px;">Pra Fashions</h1>
            <p style="color: #fdf6ecaa; margin: 8px 0 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">New Contact Form Submission</p>
          </div>
          <div style="padding: 32px; background: #fdf6ec;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-size: 13px; color: #888; width: 80px;">Name</td><td style="padding: 8px 0; font-size: 15px;">${name}</td></tr>
              <tr><td style="padding: 8px 0; font-size: 13px; color: #888;">Email</td><td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #800c0c;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #888;">Phone</td><td style="padding: 8px 0; font-size: 15px;">${phone}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; font-size: 13px; color: #888;">Subject</td><td style="padding: 8px 0; font-size: 15px;">${subject}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #f0d48a55; margin: 16px 0;" />
            <p style="font-size: 13px; color: #888; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
            <p style="font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="background: #2e0404; padding: 16px; text-align: center;">
            <p style="color: #fdf6ec55; font-size: 11px; margin: 0;">Pra Fashions · prafashions.com</p>
          </div>
        </div>
      `,
    });

    // Also send a confirmation to the customer
    await resend.emails.send({
      from:    'Pra Fashions <noreply@yourdomain.com>',
      to:      [email],
      subject: 'We received your message — Pra Fashions',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2e1a0a;">
          <div style="background: #600909; padding: 24px; text-align: center;">
            <h1 style="color: #f0d48a; margin: 0; font-size: 24px;">Pra Fashions</h1>
          </div>
          <div style="padding: 32px; background: #fdf6ec;">
            <p style="font-size: 16px;">Dear ${name},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #555;">
              Thank you for reaching out! We've received your message and will get back to you within 1–2 business days.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #555;">
              In the meantime, feel free to browse our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" style="color: #800c0c;">latest collections</a>.
            </p>
            <p style="font-size: 15px; margin-top: 24px;">Warm regards,<br /><strong>The Pra Fashions Team</strong></p>
          </div>
          <div style="background: #2e0404; padding: 16px; text-align: center;">
            <p style="color: #fdf6ec55; font-size: 11px; margin: 0;">Pra Fashions · prafashions.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please email us directly.' },
      { status: 500 }
    );
  }
}
