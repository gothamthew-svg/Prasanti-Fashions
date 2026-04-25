import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getAdminSession } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are accepted' }, { status: 400 });
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large — maximum 10MB' }, { status: 400 });
    }

    // Convert to buffer
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder:         'prafashions/products',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit' }, // cap at 1200px
                { quality: 'auto', fetch_format: 'auto' },    // auto WebP/AVIF
              ],
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) reject(error ?? new Error('Upload failed'));
              else resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url:       result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
