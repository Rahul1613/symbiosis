'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
  { value: 'snapchat', label: 'Snapchat', color: 'bg-yellow-500' },
  { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600' },
  { value: 'twitter', label: 'Twitter/X', color: 'bg-black' },
  { value: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-gray-900' },
  { value: 'github', label: 'GitHub', color: 'bg-gray-800' },
  { value: 'custom', label: 'Custom', color: 'bg-purple-500' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    avatarUrl: '',
  });
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: 'github',
    url: '',
    label: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();

      if (response.ok) {
        setProfile({
          name: data.user.name || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          avatarUrl: data.user.avatar_url || '',
        });
        // Fetch social links
        const linksResponse = await fetch('/api/users/' + (data.user as any).username);
        const linksData = await linksResponse.json();
        if (linksResponse.ok) {
          setSocialLinks(linksData.user.socialLinks || []);
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      if (response.ok) {
        const data = await response.json();
        setSocialLinks([...socialLinks, data.socialLink]);
        setNewLink({ platform: 'github', url: '', label: '' });
        setShowAddLink(false);
        toast.success('Social link added!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add link');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
        toast.success('Social link removed!');
      } else {
        toast.error('Failed to remove link');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Social Links</h2>
              <button
                onClick={() => setShowAddLink(!showAddLink)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            {showAddLink && (
              <form onSubmit={handleAddLink} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      {PLATFORMS.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label (optional)
                    </label>
                    <input
                      type="text"
                      value={newLink.label}
                      onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="My Profile"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLink(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {socialLinks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No social links added yet</p>
              ) : (
                socialLinks.map((link) => {
                  const platform = PLATFORMS.find((p) => p.value === link.platform);
                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${platform?.color || 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold`}>
                          {platform?.label.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{link.label || platform?.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Profile Preview Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-center gap-4 mb-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-gray-600">@{profile.username}</p>
                </div>
              </div>
              {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => {
                  const platform = PLATFORMS.find((p) => p.value === link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 ${platform?.color || 'bg-gray-500'} text-white rounded-full text-sm`}
                    >
                      {platform?.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
