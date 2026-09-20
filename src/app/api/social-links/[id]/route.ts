import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateSocialLinkSchema = z.object({
  platform: z.enum(['instagram', 'snapchat', 'linkedin', 'twitter', 'youtube', 'tiktok', 'github', 'custom']).optional(),
  url: z.string().url('Invalid URL').optional(),
  label: z.string().optional(),
});

// PATCH /api/social-links/[id] - Edit social link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSocialLinkSchema.parse(body);

    // Check if link belongs to user
    const linkResult = await query(
      'SELECT user_id FROM social_links WHERE id = $1',
      [id]
    );

    if (linkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Social link not found' },
        { status: 404 }
      );
    }

    if (linkResult.rows[0].user_id !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate URL if provided
    if (validatedData.url) {
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
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (validatedData.platform) {
      paramCount++;
      updates.push(`platform = $${paramCount}`);
      values.push(validatedData.platform);
    }

    if (validatedData.url) {
      paramCount++;
      updates.push(`url = $${paramCount}`);
      values.push(validatedData.url);
    }

    if (validatedData.label !== undefined) {
      paramCount++;
      updates.push(`label = $${paramCount}`);
      values.push(validatedData.label);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    paramCount++;
    values.push(id);

    const result = await query(
      `UPDATE social_links SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return NextResponse.json({
      message: 'Social link updated successfully',
      socialLink: result.rows[0]
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating social link:', error);
    return NextResponse.json(
      { error: 'Failed to update social link' },
      { status: 500 }
    );
  }
}

// DELETE /api/social-links/[id] - Remove social link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if link belongs to user
    const linkResult = await query(
      'SELECT user_id FROM social_links WHERE id = $1',
      [id]
    );

    if (linkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Social link not found' },
        { status: 404 }
      );
    }

    if (linkResult.rows[0].user_id !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await query('DELETE FROM social_links WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Social link deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    );
  }
}
