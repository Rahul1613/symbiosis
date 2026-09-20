import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const questionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(500),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  attachmentIds: z.array(z.string()).optional(),
});

// GET /api/questions - List questions (public, paginated, searchable)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'newest'; // 'newest' or 'most-answered'

    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += `WHERE (q.title ILIKE $${paramCount} OR q.body ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    let orderBy = 'q.created_at DESC';
    if (sortBy === 'most-answered') {
      orderBy = 'answer_count DESC, q.created_at DESC';
    }

    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const questionsQuery = `
      SELECT 
        q.id, q.title, q.body, q.created_at,
        u.id as user_id, u.name, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count,
        (SELECT COUNT(*) FROM attachments WHERE question_id = q.id) as attachment_count
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM questions q
      ${whereClause}
    `;

    const [questionsResult, countResult] = await Promise.all([
      query(questionsQuery, queryParams),
      query(countQuery, queryParams.slice(0, paramCount - 2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      questions: questionsResult.rows,
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
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/questions - Create question (requires auth)
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
    const validatedData = questionSchema.parse(body);

    const questionId = `q_${Date.now()}`;
    const result = await query(
      'INSERT INTO questions (id, user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [questionId, (session.user as any).id, validatedData.title, validatedData.body]
    );

    // If attachment IDs are provided, link them to the question
    if (validatedData.attachmentIds && validatedData.attachmentIds.length > 0) {
      for (const attachmentId of validatedData.attachmentIds) {
        await query(
          'UPDATE attachments SET question_id = $1 WHERE id = $2',
          [questionId, attachmentId]
        );
      }
    }

    return NextResponse.json({
      message: 'Question created successfully',
      question: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
