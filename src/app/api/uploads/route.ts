import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/zip',
  'application/x-zip-compressed',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const MAX_FILES_PER_UPLOAD = 5;

// POST /api/uploads - Upload file with Vercel Blob or database/local fallback
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES_PER_UPLOAD} files allowed per upload` },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 10MB` },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed. Allowed types: PDF, DOCX, XLSX, PNG, JPG, ZIP` },
          { status: 400 }
        );
      }

      // Check for executable files
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.exe') || fileName.endsWith('.sh') || fileName.endsWith('.bat')) {
        return NextResponse.json(
          { error: 'Executable files are not allowed' },
          { status: 400 }
        );
      }

      const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      let fileUrl = `/api/uploads/${attachmentId}`;
      let fileData: string | null = null;

      // 1. Try Vercel Blob if token is configured
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const safeName = `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`;
          const blob = await put(safeName, file, { access: 'public' });
          fileUrl = blob.url;
        } catch (blobErr) {
          console.warn('Vercel Blob upload failed, falling back to database storage:', blobErr);
        }
      }

      // 2. If Vercel Blob wasn't used or failed, store in database & local disk
      if (!fileUrl.startsWith('http')) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fileData = buffer.toString('base64');

        // Also write to local public/uploads for local dev access
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            await fs.promises.mkdir(uploadsDir, { recursive: true });
          }
          const diskFileName = `${attachmentId}_${file.name.replace(/[^\w.-]/g, '_')}`;
          await fs.promises.writeFile(path.join(uploadsDir, diskFileName), buffer);
        } catch (diskErr) {
          console.warn('Local disk write skipped:', diskErr);
        }
      }

      try {
        // Create attachment record in database
        await query(
          'INSERT INTO attachments (id, file_url, file_name, file_type, file_size, file_data) VALUES ($1, $2, $3, $4, $5, $6)',
          [attachmentId, fileUrl, file.name, file.type, file.size, fileData]
        );

        uploadedFiles.push({
          id: attachmentId,
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      } catch (dbErr) {
        console.error('Error saving attachment to database:', dbErr);
        return NextResponse.json(
          { error: `Failed to save file ${file.name}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    }, { status: 201 });

  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to handle file upload' },
      { status: 500 }
    );
  }
}
