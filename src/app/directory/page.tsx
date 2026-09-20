'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ExternalLink } from 'lucide-react';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: ExternalLink, color: 'bg-pink-500' },
  { value: 'snapchat', label: 'Snapchat', icon: ExternalLink, color: 'bg-yellow-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: ExternalLink, color: 'bg-blue-600' },
  { value: 'twitter', label: 'Twitter/X', icon: ExternalLink, color: 'bg-black' },
  { value: 'youtube', label: 'YouTube', icon: ExternalLink, color: 'bg-red-600' },
  { value: 'tiktok', label: 'TikTok', icon: ExternalLink, color: 'bg-gray-900' },
  { value: 'github', label: 'GitHub', icon: ExternalLink, color: 'bg-gray-800' },
  { value: 'custom', label: 'Custom', icon: ExternalLink, color: 'bg-purple-500' },
];

export default function DirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page, search, selectedPlatform]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (search) params.append('search', search);
      if (selectedPlatform) params.append('platform', selectedPlatform);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setUsers(data.users);
        } else {
          setUsers([...users, ...data.users]);
        }
        setHasMore(data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setUsers([]);
    fetchUsers();
  };

  const handlePlatformFilter = (platform: string) => {
    setSelectedPlatform(platform === selectedPlatform ? '' : platform);
    setPage(1);
    setUsers([]);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Directory</h1>
          <p className="text-gray-600">Discover and connect with people in our community</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or username..."
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

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by platform:
            </span>
            {PLATFORMS.map((platform) => (
              <button
                key={platform.value}
                onClick={() => handlePlatformFilter(platform.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedPlatform === platform.value
                    ? `${platform.color} text-white`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Grid */}
        {isLoading && users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No users found</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                      <p className="text-gray-600 text-sm">@{user.username}</p>
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{user.bio}</p>
                  )}

                  {user.social_links_count > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{user.social_links_count} platforms</span>
                    </div>
                  )}
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
