import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// PATCH /api/users/me - Update own profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if username is being changed and if it's already taken
    if (validatedData.username) {
      const existingUser = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [validatedData.username, (session.user as any).id]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (validatedData.name) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(validatedData.name);
    }

    if (validatedData.username) {
      paramCount++;
      updates.push(`username = $${paramCount}`);
      values.push(validatedData.username);
    }

    if (validatedData.bio !== undefined) {
      paramCount++;
      updates.push(`bio = $${paramCount}`);
      values.push(validatedData.bio);
    }

    if (validatedData.avatarUrl) {
      paramCount++;
      updates.push(`avatar_url = $${paramCount}`);
      values.push(validatedData.avatarUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    paramCount++;
    values.push((session.user as any).id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, name, username, email, avatar_url, bio`,
      values
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'SELECT id, name, username, email, avatar_url, bio, created_at FROM users WHERE id = $1',
      [(session.user as any).id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: result.rows[0] });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
