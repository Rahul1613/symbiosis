'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MessageSquare, Clock, FileText, Download, ArrowLeft, Trash2, Upload, X } from 'lucide-react';

const cardClass = 'bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6';
const inputClass =
  'w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerBody, setAnswerBody] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchQuestion(); }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${id}`);
      const data = await response.json();
      if (response.ok) setQuestion(data.question);
      else toast.error('Failed to load question');
    } catch { toast.error('Failed to load question'); }
    finally { setIsLoading(false); }
  };

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
      else toast.error(data.error || 'Failed to upload');
    } catch { toast.error('Failed to upload files'); }
    finally { setIsUploading(false); }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) { toast.error('Please enter your answer'); return; }
    setIsAnswering(true);
    try {
      const response = await fetch(`/api/questions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody, attachmentIds: uploadedFiles.map((f) => f.id) }),
      });
      if (response.ok) { toast.success('Answer posted!'); setAnswerBody(''); setUploadedFiles([]); fetchQuestion(); }
      else { const data = await response.json(); toast.error(data.error || 'Failed to post answer'); }
    } catch { toast.error('Failed to post answer'); }
    finally { setIsAnswering(false); }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm('Delete this question?')) return;
    try {
      const r = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (r.ok) { toast.success('Question deleted'); router.push('/questions'); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm('Delete this answer?')) return;
    try {
      const r = await fetch(`/api/answers/${answerId}`, { method: 'DELETE' });
      if (r.ok) { toast.success('Answer deleted'); fetchQuestion(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  const AttachmentLink = ({ attachment }: { attachment: any }) => (
    <a
      href={attachment.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition text-sm text-[var(--foreground)]"
    >
      <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
      <span>{attachment.file_name}</span>
      <Download className="w-4 h-4 text-[var(--muted-foreground)]" />
    </a>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading question...</div>
    </div>
  );

  if (!question) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)]">Question not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/questions" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Questions
        </Link>

        {/* Question */}
        <div className={cardClass}>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-[var(--foreground)] pr-4">{question.title}</h1>
            {session?.user?.id === question.user_id && (
              <button onClick={handleDeleteQuestion} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-[var(--foreground)] mb-4 whitespace-pre-wrap">{question.body}</p>

          {question.attachments?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {question.attachments.map((a: any) => <AttachmentLink key={a.id} attachment={a} />)}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            {question.avatar_url
              ? <img src={question.avatar_url} alt={question.name} className="w-6 h-6 rounded-full" />
              : <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">{question.name?.charAt(0)}</div>
            }
            <span>{question.name}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(question.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Answers */}
        <div className={cardClass}>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-5">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {question.answers.length === 0 ? (
            <p className="text-[var(--muted-foreground)] text-center py-8">No answers yet. Be the first to answer!</p>
          ) : (
            <div className="space-y-6">
              {question.answers.map((answer: any) => (
                <div key={answer.id} className="border-b border-[var(--border)] pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {answer.avatar_url
                        ? <img src={answer.avatar_url} alt={answer.name} className="w-10 h-10 rounded-full" />
                        : <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">{answer.name?.charAt(0)}</div>
                      }
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{answer.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{new Date(answer.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {session?.user?.id === answer.user_id && (
                      <button onClick={() => handleDeleteAnswer(answer.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[var(--foreground)] mb-3 whitespace-pre-wrap">{answer.body}</p>
                  {answer.attachments?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {answer.attachments.map((a: any) => <AttachmentLink key={a.id} attachment={a} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {session ? (
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Post Your Answer</h2>
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={5}
                className={inputClass}
                placeholder="Write your answer..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Attachments (optional)</label>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="answer-file-upload" accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip" />
                <label htmlFor="answer-file-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] hover:border-[var(--primary)] transition text-sm">
                  <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Attach files'}
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)]">
                      <FileText className="w-4 h-4" />
                      <span>{file.fileName}</span>
                      <button type="button" onClick={() => setUploadedFiles(uploadedFiles.filter((f) => f.id !== file.id))} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={isAnswering || isUploading} className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium">
                {isAnswering ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className={`${cardClass} text-center`}>
            <p className="text-[var(--muted-foreground)]">
              Please <Link href="/login" className="text-[var(--primary)] hover:underline">login</Link> to post an answer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
