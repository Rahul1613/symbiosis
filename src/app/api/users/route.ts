import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/users - List all users (public, paginated)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') || '';

    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += `WHERE (name ILIKE $${paramCount} OR username ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (platform) {
      paramCount++;
      const operator = whereClause ? 'AND' : 'WHERE';
      whereClause += ` ${operator} EXISTS (
        SELECT 1 FROM social_links 
        WHERE social_links.user_id = users.id 
        AND social_links.platform = $${paramCount}
      )`;
      queryParams.push(platform);
    }

    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const usersQuery = `
      SELECT 
        id, name, username, email, avatar_url, bio, created_at,
        (SELECT COUNT(*) FROM social_links WHERE user_id = users.id) as social_links_count
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `;

    const [usersResult, countResult] = await Promise.all([
      query(usersQuery, queryParams),
      query(countQuery, queryParams.slice(0, paramCount - 2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
