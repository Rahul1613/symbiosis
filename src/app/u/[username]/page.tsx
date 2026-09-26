'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, MessageSquare, Calendar } from 'lucide-react';
import { PLATFORMS } from '@/lib/platforms';

const cardClass = 'bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();
      if (response.ok) setProfile(data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading profile...</div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)]">Profile not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className={cardClass}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-[var(--border)]" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-4xl">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[var(--foreground)] mb-1">{profile.name}</h1>
              <p className="text-[var(--muted-foreground)] text-lg mb-2">@{profile.username}</p>
              {profile.bio && <p className="text-[var(--foreground)] mb-4">{profile.bio}</p>}
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[var(--muted-foreground)]">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {profile.socialLinks?.length > 0 && (
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.socialLinks.map((link: any) => {
                const platform = PLATFORMS[link.platform] || PLATFORMS.custom;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 ${platform.color} ${platform.textColor} rounded-xl hover:opacity-90 hover:scale-105 transition-all`}
                  >
                    <span className="w-6 h-6 flex-shrink-0" dangerouslySetInnerHTML={{ __html: platform.logo }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{link.label || platform.label}</p>
                      <p className="text-xs opacity-75 truncate">{link.url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-60 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* User's Questions */}
        {profile.questions?.length > 0 && (
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Questions by {profile.name}
            </h2>
            <div className="space-y-3">
              {profile.questions.map((question: any) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="block p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] bg-[var(--secondary)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--foreground)] mb-1">{question.title}</h3>
                      <p className="text-[var(--muted-foreground)] text-sm line-clamp-2">{question.body}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] whitespace-nowrap">
                      <MessageSquare className="w-4 h-4" />
                      <span>{question.answer_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
