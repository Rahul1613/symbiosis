import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/users/[username] - Get single user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const userResult = await query(
      `SELECT 
        id, name, username, email, avatar_url, bio, created_at
      FROM users 
      WHERE username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Get social links
    const socialLinksResult = await query(
      'SELECT id, platform, url, label FROM social_links WHERE user_id = $1 ORDER BY created_at',
      [user.id]
    );

    // Get user's questions
    const questionsResult = await query(
      `SELECT 
        q.id, q.title, q.body, q.created_at,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
      FROM questions q
      WHERE q.user_id = $1
      ORDER BY q.created_at DESC
      LIMIT 10`,
      [user.id]
    );

    return NextResponse.json({
      user: {
        ...user,
        socialLinks: socialLinksResult.rows,
        questions: questionsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
