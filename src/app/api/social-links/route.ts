import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.enum(['instagram', 'snapchat', 'linkedin', 'twitter', 'youtube', 'tiktok', 'github', 'custom']),
  url: z.string().url('Invalid URL'),
  label: z.string().optional(),
});

// POST /api/social-links - Add new social link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = socialLinkSchema.parse(body);

    // Validate URL to prevent XSS
    try {
      const url = new URL(validatedData.url);
      if (url.protocol === 'javascript:') {
        return NextResponse.json(
          { error: 'Invalid URL protocol' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const linkId = `link_${Date.now()}`;
    const result = await query(
      'INSERT INTO social_links (id, user_id, platform, url, label) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [linkId, (session.user as any).id, validatedData.platform, validatedData.url, validatedData.label || null]
    );

    return NextResponse.json({
      message: 'Social link added successfully',
      socialLink: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error adding social link:', error);
    return NextResponse.json(
      { error: 'Failed to add social link' },
      { status: 500 }
    );
  }
}
