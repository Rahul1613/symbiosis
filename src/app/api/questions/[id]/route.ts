import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/questions/[id] - Get single question with answers and attachments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get question with user info
    const questionResult = await query(
      `SELECT 
        q.id, q.title, q.body, q.created_at,
        u.id as user_id, u.name, u.username, u.avatar_url
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = $1`,
      [id]
    );

    if (questionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const question = questionResult.rows[0];

    // Get question attachments
    const attachmentsResult = await query(
      'SELECT id, file_url, file_name, file_type, file_size, uploaded_at FROM attachments WHERE question_id = $1',
      [id]
    );

    // Get answers with user info and attachments
    const answersResult = await query(
      `SELECT 
        a.id, a.body, a.created_at,
        u.id as user_id, u.name, u.username, u.avatar_url
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC`,
      [id]
    );

    // Get attachments for each answer
    const answersWithAttachments = await Promise.all(
      answersResult.rows.map(async (answer) => {
        const answerAttachments = await query(
          'SELECT id, file_url, file_name, file_type, file_size, uploaded_at FROM attachments WHERE answer_id = $1',
          [answer.id]
        );
        return {
          ...answer,
          attachments: answerAttachments.rows
        };
      })
    );

    return NextResponse.json({
      question: {
        ...question,
        attachments: attachmentsResult.rows,
        answers: answersWithAttachments
      }
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - Delete question (owner only)
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

    // Check if question belongs to user
    const questionResult = await query(
      'SELECT user_id FROM questions WHERE id = $1',
      [id]
    );

    if (questionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (questionResult.rows[0].user_id !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await query('DELETE FROM questions WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Question deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
