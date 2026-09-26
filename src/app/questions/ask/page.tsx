'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Upload, X } from 'lucide-react';

const inputClass =
  'w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition';

export default function AskQuestionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!session) router.push('/login');
  }, [session, router]);

  if (!session) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    try {
      const response = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok) { setUploadedFiles([...uploadedFiles, ...data.files]); toast.success('Files uploaded!'); }
      else toast.error(data.error || 'Failed to upload files');
    } catch { toast.error('Failed to upload files'); }
    finally { setIsUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { toast.error('Please fill in all required fields'); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, attachmentIds: uploadedFiles.map((f) => f.id) }),
      });
      if (response.ok) { toast.success('Question posted!'); router.push('/questions'); }
      else { const data = await response.json(); toast.error(data.error || 'Failed to post question'); }
    } catch { toast.error('Failed to post question'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/questions" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Questions
        </Link>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Ask a Question</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="What's your question?"
                required
                minLength={5}
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Details *
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className={inputClass}
                placeholder="Provide more details about your question..."
                required
                minLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--primary)] transition-colors">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-[var(--muted-foreground)]" />
                  <span className="text-[var(--foreground)]">{isUploading ? 'Uploading...' : 'Click to upload files'}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">PDF, DOCX, XLSX, PNG, JPG, ZIP (max 10MB each)</span>
                </label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)]">
                    <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span>{file.fileName}</span>
                    <button type="button" onClick={() => setUploadedFiles(uploadedFiles.filter((f) => f.id !== file.id))} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button type="submit" disabled={isSubmitting || isUploading} className="flex-1 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium">
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </button>
              <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--secondary)] transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
