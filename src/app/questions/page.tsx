'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search, Clock, TrendingUp } from 'lucide-react';

const inputClass =
  'w-full pl-10 pr-4 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition';

export default function QuestionsPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [page, sortBy]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10', sortBy });
      if (search) params.append('search', search);
      const response = await fetch(`/api/questions?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setQuestions(page === 1 ? data.questions : [...questions, ...data.questions]);
        setHasMore(data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuestions([]);
    fetchQuestions();
  };

  const sortBtnClass = (val: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
      sortBy === val
        ? 'bg-[var(--primary)] text-white'
        : 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
    }`;

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Questions &amp; Answers</h1>
            <p className="text-[var(--muted-foreground)]">Ask questions and share knowledge with the community</p>
          </div>
          {session && (
            <Link
              href="/questions/ask"
              className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition font-medium whitespace-nowrap"
            >
              Ask a Question
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2">
            <button onClick={() => { setSortBy('newest'); setPage(1); }} className={sortBtnClass('newest')}>
              <Clock className="w-4 h-4" /> Newest
            </button>
            <button onClick={() => { setSortBy('most-answered'); setPage(1); }} className={sortBtnClass('most-answered')}>
              <TrendingUp className="w-4 h-4" /> Most Answered
            </button>
          </div>
        </div>

        {/* Questions List */}
        {isLoading && questions.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)] animate-pulse">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)] mb-4">No questions found</p>
            {session && (
              <Link href="/questions/ask" className="text-[var(--primary)] hover:underline font-medium">
                Be the first to ask a question!
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="block bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition-colors p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center text-center min-w-[56px] bg-[var(--secondary)] rounded-lg py-2 px-1">
                      <div className="text-2xl font-bold text-[var(--foreground)]">{question.answer_count}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">answers</div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1 hover:text-[var(--primary)] transition-colors">
                        {question.title}
                      </h2>
                      <p className="text-[var(--muted-foreground)] text-sm mb-3 line-clamp-2">{question.body}</p>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1.5">
                          {question.avatar_url ? (
                            <img src={question.avatar_url} alt={question.name} className="w-5 h-5 rounded-full" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">
                              {question.name?.charAt(0)}
                            </div>
                          )}
                          <span>{question.name}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                        {question.attachment_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{question.attachment_count} attachment(s)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition font-medium"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
