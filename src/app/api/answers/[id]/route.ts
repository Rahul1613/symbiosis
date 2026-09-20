import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE /api/answers/[id] - Delete answer (owner only)
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

    // Check if answer belongs to user
    const answerResult = await query(
      'SELECT user_id FROM answers WHERE id = $1',
      [id]
    );

    if (answerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }

    if (answerResult.rows[0].user_id !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await query('DELETE FROM answers WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Answer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting answer:', error);
    return NextResponse.json(
      { error: 'Failed to delete answer' },
      { status: 500 }
    );
  }
}
