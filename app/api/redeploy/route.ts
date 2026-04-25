/**
 * app/api/redeploy/route.ts
 *
 * A secret URL your mom can bookmark. When she visits it after
 * updating the spreadsheet, it triggers a Vercel redeploy so
 * the website reflects her changes within ~1 minute.
 *
 * Setup:
 * 1. In Vercel dashboard → Project → Settings → Git → Deploy Hooks
 * 2. Create a hook called "Mom's Update Button" → copy the URL
 * 3. Add to .env.local:  VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
 * 4. Share this URL with your mom:  https://yourdomain.com/api/redeploy?key=YOUR_SECRET
 * 5. Add to .env.local:  REDEPLOY_SECRET=pick-any-random-word
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (!process.env.REDEPLOY_SECRET || key !== process.env.REDEPLOY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.VERCEL_DEPLOY_HOOK_URL) {
    return NextResponse.json({ error: 'Deploy hook not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    if (!res.ok) throw new Error(`Hook returned ${res.status}`);

    // Return a friendly HTML page instead of JSON
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Website Updating...</title>
  <style>
    body { font-family: Georgia, serif; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #fdf6ec; color: #4a0707; text-align: center; padding: 2rem; }
    .box { max-width: 480px; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #600909; }
    p { font-size: 1rem; line-height: 1.7; color: #555; margin-bottom: 0.75rem; }
    .tick { font-size: 3rem; color: #d4a017; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="box">
    <div class="tick">✦</div>
    <h1>Website is updating!</h1>
    <p>Your changes from the spreadsheet are being applied to the website.</p>
    <p>It usually takes about <strong>1–2 minutes</strong>.</p>
    <p>You can close this page. Refresh the website in a couple of minutes to see your updates.</p>
  </div>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err) {
    console.error('[redeploy]', err);
    return NextResponse.json({ error: 'Failed to trigger deploy' }, { status: 500 });
  }
}
