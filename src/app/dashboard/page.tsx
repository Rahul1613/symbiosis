'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, X } from 'lucide-react';
import { PLATFORMS } from '@/lib/platforms';

const PLATFORM_LIST = Object.entries(PLATFORMS).map(([value, p]) => ({ value, ...p }));

const inputClass =
  'w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition';

const cardClass = 'bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm';

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
    } catch {
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
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/social-links/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
        toast.success('Social link removed!');
      } else {
        toast.error('Failed to remove link');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--muted-foreground)] animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>

        {/* Edit Profile Card */}
        <div className={cardClass}>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-5">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className={inputClass}
                  placeholder="yourhandle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className={inputClass}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Social Links Card */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Social Links</h2>
            <button
              onClick={() => setShowAddLink(!showAddLink)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition text-sm font-medium"
            >
              {showAddLink ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddLink ? 'Cancel' : 'Add Link'}
            </button>
          </div>

          {showAddLink && (
            <form
              onSubmit={handleAddLink}
              className="mb-6 p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)] space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Platform
                  </label>
                  <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className={inputClass}
                  >
                    {PLATFORM_LIST.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={newLink.label}
                    onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                    className={inputClass}
                    placeholder="My Profile"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
              >
                Add Link
              </button>
            </form>
          )}

          <div className="space-y-3">
            {socialLinks.length === 0 ? (
              <p className="text-[var(--muted-foreground)] text-center py-8">
                No social links added yet
              </p>
            ) : (
              socialLinks.map((link) => {
                const platform = PLATFORMS[link.platform] || PLATFORMS.custom;
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center ${platform.textColor} hover:opacity-80 transition shadow-sm`}
                      >
                        <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: platform.logo }} />
                      </a>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {link.label || platform.label}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
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
        <div className={cardClass}>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-5">Profile Preview</h2>
          <div className="rounded-lg p-6 bg-[var(--secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-4 mb-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--border)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">
                  {profile.name.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">{profile.name || 'Your Name'}</h3>
                <p className="text-[var(--muted-foreground)]">@{profile.username || 'username'}</p>
              </div>
            </div>
            {profile.bio && (
              <p className="text-[var(--foreground)] text-sm mb-4">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const platform = PLATFORMS[link.platform] || PLATFORMS.custom;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 ${platform.color} ${platform.textColor} rounded-full text-xs font-medium hover:opacity-90 transition`}
                  >
                    <span className="w-3.5 h-3.5" dangerouslySetInnerHTML={{ __html: platform.logo }} />
                    {link.label || platform.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
