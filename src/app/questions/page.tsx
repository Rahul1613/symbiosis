'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search, MessageSquare, Clock, TrendingUp } from 'lucide-react';

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
  }, [page, search, sortBy]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
      });

      if (search) params.append('search', search);

      const response = await fetch(`/api/questions?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setQuestions(data.questions);
        } else {
          setQuestions([...questions, ...data.questions]);
        }
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

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Questions & Answers</h1>
            <p className="text-gray-600">Ask questions and share knowledge with the community</p>
          </div>
          {session && (
            <Link
              href="/questions/ask"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ask a Question
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'newest'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Newest
            </button>
            <button
              onClick={() => setSortBy('most-answered')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'most-answered'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Most Answered
            </button>
          </div>
        </div>

        {/* Questions List */}
        {isLoading && questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading questions...</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">No questions found</div>
            {session && (
              <Link
                href="/questions/ask"
                className="text-gray-900 hover:underline"
              >
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
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                      <div className="text-2xl font-bold text-gray-900">
                        {question.answer_count}
                      </div>
                      <div className="text-xs text-gray-500">answers</div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 hover:text-gray-700 transition-colors">
                        {question.title}
                      </h2>
                      <p className="text-gray-600 mb-3 line-clamp-2">{question.body}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {question.avatar_url ? (
                            <img
                              src={question.avatar_url}
                              alt={question.name}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                              {question.name.charAt(0)}
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
                  onClick={loadMore}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
