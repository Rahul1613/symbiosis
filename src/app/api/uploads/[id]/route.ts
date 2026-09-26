import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// GET /api/uploads/[id] - Serve uploaded file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await query(
      'SELECT id, file_url, file_name, file_type, file_size, file_data FROM attachments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = result.rows[0];

    // If file data is stored in DB as base64
    if (file.file_data) {
      const buffer = Buffer.from(file.file_data, 'base64');
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': file.file_type || 'application/octet-stream',
          'Content-Length': buffer.length.toString(),
          'Content-Disposition': `inline; filename="${encodeURIComponent(file.file_name)}"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // If file_url is an external URL (e.g. Vercel Blob)
    if (file.file_url.startsWith('http://') || file.file_url.startsWith('https://')) {
      return NextResponse.redirect(file.file_url);
    }

    // If file is stored locally in public/
    if (file.file_url.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', file.file_url);
      if (fs.existsSync(localPath)) {
        const fileBuffer = await fs.promises.readFile(localPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': file.file_type || 'application/octet-stream',
            'Content-Length': fileBuffer.length.toString(),
            'Content-Disposition': `inline; filename="${encodeURIComponent(file.file_name)}"`,
          },
        });
      }
    }

    return NextResponse.json({ error: 'File content unavailable' }, { status: 404 });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
