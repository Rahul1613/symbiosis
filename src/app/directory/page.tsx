'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { PLATFORMS } from '@/lib/platforms';

function Avatar({ name, avatarUrl, size = 16 }: { name: string; avatarUrl?: string; size?: number }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const auto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  const src = avatarUrl || auto;

  if (avatarUrl) {
    return <img src={src} alt={name} className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-[var(--border)]`} />;
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-[var(--primary)] to-violet-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-[var(--border)] select-none`}>
      {initials}
    </div>
  );
}

const PLATFORM_KEYS = Object.keys(PLATFORMS).filter(k => k !== 'custom');

export default function DirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers(1, true);
  }, [selectedPlatform]);

  const fetchUsers = async (p = page, reset = false) => {
    try {
      const params = new URLSearchParams({ page: p.toString(), limit: '12' });
      if (search) params.append('search', search);
      if (selectedPlatform) params.append('platform', selectedPlatform);
      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(reset ? data.users : prev => [...prev, ...data.users]);
        setHasMore(data.pagination.hasNextPage);
        setPage(p);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    fetchUsers(1, true);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-[var(--card)] via-[var(--background)] to-[var(--card)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-2">
            🌐 User Directory
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg">
            Discover people and connect across all your favourite platforms — instantly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Filter bar */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or username…"
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition font-medium">
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {PLATFORM_KEYS.map((key) => {
              const p = PLATFORMS[key];
              const active = selectedPlatform === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(active ? '' : key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                    active
                      ? `${p.color} ${p.textColor} border-transparent shadow-md`
                      : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 flex-shrink-0 ${active ? p.textColor : 'opacity-70'}`}
                    dangerouslySetInnerHTML={{ __html: p.logo }} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {isLoading && users.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 animate-pulse h-52" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted-foreground)]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchUsers(page + 1)}
                  className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition font-medium"
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

function UserCard({ user }: { user: any }) {
  const links: any[] = user.social_links || [];
  const initials = user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-200">
      {/* Top accent strip */}
      <div className={`h-1 w-full ${links[0] ? PLATFORMS[links[0].platform]?.color || 'bg-[var(--primary)]' : 'bg-[var(--primary)]'}`} />

      <div className="p-5">
        {/* Avatar + name */}
        <Link href={`/u/${user.username}`} className="flex items-center gap-3 mb-4">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--border)] group-hover:ring-[var(--primary)] transition" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-violet-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-[var(--border)] group-hover:ring-[var(--primary)] transition select-none">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition">{user.name}</h3>
            <p className="text-[var(--muted-foreground)] text-sm">@{user.username}</p>
          </div>
        </Link>

        {user.bio && (
          <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 mb-4">{user.bio}</p>
        )}

        {/* Social platform icon buttons */}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-auto">
            {links.map((link) => {
              const plat = PLATFORMS[link.platform] || PLATFORMS.custom;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label || plat.label}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-center w-9 h-9 rounded-xl ${plat.color} ${plat.textColor} hover:opacity-80 hover:scale-110 transition-all duration-150 shadow-sm`}
                >
                  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: plat.logo }} />
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)] italic mt-auto">No social links yet</p>
        )}
      </div>
    </div>
  );
}
