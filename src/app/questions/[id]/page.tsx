'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MessageSquare, Clock, FileText, Download, ArrowLeft, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${id}`);
      const data = await response.json();

      if (response.ok) {
        setQuestion(data.question);
      } else {
        toast.error('Failed to load question');
      }
    } catch (error) {
      toast.error('Failed to load question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFiles([...uploadedFiles, ...data.files]);
        toast.success('Files uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload files');
      }
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) {
      toast.error('Please enter your answer');
      return;
    }

    setIsAnswering(true);

    try {
      const response = await fetch(`/api/questions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: answerBody,
          attachmentIds: uploadedFiles.map((f) => f.id),
        }),
      });

      if (response.ok) {
        toast.success('Answer posted successfully!');
        setAnswerBody('');
        setUploadedFiles([]);
        fetchQuestion();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to post answer');
      }
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setIsAnswering(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Question deleted successfully');
        router.push('/questions');
      } else {
        toast.error('Failed to delete question');
      }
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;

    try {
      const response = await fetch(`/api/answers/${answerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Answer deleted successfully');
        fetchQuestion();
      } else {
        toast.error('Failed to delete answer');
      }
    } catch (error) {
      toast.error('Failed to delete answer');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('image')) return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading question...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Question not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/questions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </Link>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{question.title}</h1>
            {session?.user?.id === question.user_id && (
              <button
                onClick={handleDeleteQuestion}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{question.body}</p>

          {/* Question Attachments */}
          {question.attachments && question.attachments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {question.attachments.map((attachment: any) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {getFileIcon(attachment.file_type)}
                    <span className="text-sm">{attachment.file_name}</span>
                    <Download className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {question.avatar_url ? (
                <img
                  src={question.avatar_url}
                  alt={question.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                  {question.name.charAt(0)}
                </div>
              )}
              <span>{question.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(question.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {question.answers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No answers yet. Be the first to answer!</p>
          ) : (
            <div className="space-y-6">
              {question.answers.map((answer: any) => (
                <div key={answer.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {answer.avatar_url ? (
                        <img
                          src={answer.avatar_url}
                          alt={answer.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          {answer.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{answer.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(answer.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {session?.user?.id === answer.user_id && (
                      <button
                        onClick={() => handleDeleteAnswer(answer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{answer.body}</p>

                  {/* Answer Attachments */}
                  {answer.attachments && answer.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {answer.attachments.map((attachment: any) => (
                        <a
                          key={attachment.id}
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {getFileIcon(attachment.file_type)}
                          <span className="text-sm">{attachment.file_name}</span>
                          <Download className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {session ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Post Your Answer</h2>
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <textarea
                  value={answerBody}
                  onChange={(e) => setAnswerBody(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Write your answer..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                />
                {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{file.fileName}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(uploadedFiles.filter((f) => f.id !== file.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isAnswering || isUploading}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isAnswering ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">
              Please <Link href="/login" className="text-gray-900 hover:underline">login</Link> to post an answer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
