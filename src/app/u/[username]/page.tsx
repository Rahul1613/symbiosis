'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, MessageSquare, Calendar } from 'lucide-react';

const PLATFORMS: any = {
  instagram: { label: 'Instagram', color: 'bg-pink-500' },
  snapchat: { label: 'Snapchat', color: 'bg-yellow-500' },
  linkedin: { label: 'LinkedIn', color: 'bg-blue-600' },
  twitter: { label: 'Twitter/X', color: 'bg-black' },
  youtube: { label: 'YouTube', color: 'bg-red-600' },
  tiktok: { label: 'TikTok', color: 'bg-gray-900' },
  github: { label: 'GitHub', color: 'bg-gray-800' },
  custom: { label: 'Custom', color: 'bg-purple-500' },
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
      } else {
        console.error('Failed to fetch profile:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-4xl">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-gray-600 text-lg mb-2">@{profile.username}</p>
              {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.socialLinks.map((link: any) => {
                const platform = PLATFORMS[link.platform] || PLATFORMS.custom;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{link.label || platform.label}</p>
                      <p className="text-sm opacity-90 truncate">{link.url}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* User's Questions */}
        {profile.questions && profile.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Questions by {profile.name}
            </h2>
            <div className="space-y-4">
              {profile.questions.map((question: any) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{question.body}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
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
