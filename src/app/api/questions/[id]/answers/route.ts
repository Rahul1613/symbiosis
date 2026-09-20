import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const answerSchema = z.object({
  body: z.string().min(10, 'Answer must be at least 10 characters'),
  attachmentIds: z.array(z.string()).optional(),
});

// POST /api/questions/[id]/answers - Post answer (requires auth)
export async function POST(
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

    const { id: questionId } = await params;
    const body = await request.json();
    const validatedData = answerSchema.parse(body);

    // Check if question exists
    const questionResult = await query(
      'SELECT id FROM questions WHERE id = $1',
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const answerId = `a_${Date.now()}`;
    const result = await query(
      'INSERT INTO answers (id, question_id, user_id, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [answerId, questionId, (session.user as any).id, validatedData.body]
    );

    // If attachment IDs are provided, link them to the answer
    if (validatedData.attachmentIds && validatedData.attachmentIds.length > 0) {
      for (const attachmentId of validatedData.attachmentIds) {
        await query(
          'UPDATE attachments SET answer_id = $1 WHERE id = $2',
          [answerId, attachmentId]
        );
      }
    }

    return NextResponse.json({
      message: 'Answer posted successfully',
      answer: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error posting answer:', error);
    return NextResponse.json(
      { error: 'Failed to post answer' },
      { status: 500 }
    );
  }
}
