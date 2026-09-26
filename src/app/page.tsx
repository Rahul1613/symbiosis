import Link from 'next/link';
import { Users, MessageSquare, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Hero */}
      <div className="relative">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] text-sm mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            Your social hub — all platforms, one place
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--foreground)] mb-6 leading-tight tracking-tight">
            Connect. Share.{' '}
            <span className="bg-gradient-to-r from-[var(--primary)] via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Discover.
            </span>
          </h1>

          <p className="text-xl text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
            Build your public profile with all your social links in one place, 
            ask questions, and connect with a growing community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[var(--primary)]/30"
            >
              Get Started Free →
            </Link>
            <Link
              href="/directory"
              className="px-8 py-4 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded-2xl font-semibold text-lg hover:border-[var(--primary)] transition-all hover:scale-105"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Platform icons strip */}
      <div className="border-y border-[var(--border)] bg-[var(--card)] py-6">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-[var(--muted-foreground)] mb-4 uppercase tracking-widest">All your platforms in one profile</p>
          <div className="flex justify-center flex-wrap gap-4">
            {[
              { name: 'Instagram', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>` },
              { name: 'GitHub', color: 'bg-gray-900', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>` },
              { name: 'LinkedIn', color: 'bg-blue-700', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
              { name: 'Twitter/X', color: 'bg-black', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
              { name: 'YouTube', color: 'bg-red-600', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>` },
              { name: 'TikTok', color: 'bg-neutral-900', logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/></svg>` },
              { name: 'Snapchat', color: 'bg-yellow-400', logo: `<svg viewBox="0 0 24 24" fill="black"><path d="M12.166.006C9.809-.007 5.55 .641 3.838 5.014c-.48 1.213-.386 3.302-.386 3.302s-1.093.053-2.15.362c-.586.172-.853.596-.792.986.062.394.467.686.937.785.143.03 1.477.346 1.8 1.488.04.145.056.304.056.304-.016.025-2.166 3.44-2.166 3.44S.48 16.5 1.72 16.84c.81.222 1.388.012 1.388.012s.003.076.006.183c.034 1.302.265 2.175 2.26 2.175.175 0 .353.013.534.04 1.001.144 2.097 1.4 3.563 1.993.935.38 2.005.557 3.17.556 1.165.001 2.236-.177 3.17-.556 1.466-.594 2.562-1.85 3.563-1.993.181-.028.36-.04.534-.04 1.994 0 2.226-.873 2.26-2.175.003-.107.006-.183.006-.183s.577.21 1.388-.013c1.24-.338.983-1.159.983-1.159S22.161 11.27 22.145 11.245c0 0 .016-.159.056-.304.323-1.142 1.657-1.458 1.8-1.488.47-.099.875-.391.937-.785.061-.39-.206-.814-.792-.986-1.057-.309-2.15-.362-2.15-.362s.094-2.089-.386-3.302C19.898.631 15.636-.007 12.166.006z"/></svg>` },
            ].map((plat) => (
              <div
                key={plat.name}
                title={plat.name}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl ${plat.color} text-white shadow-md hover:scale-110 transition-transform`}
              >
                <span className="w-6 h-6" dangerouslySetInnerHTML={{ __html: plat.logo }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Directory card */}
          <Link
            href="/directory"
            className="group relative overflow-hidden bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/5 rounded-full -translate-y-10 translate-x-10 group-hover:bg-[var(--primary)]/10 transition" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-[var(--primary)]/10 rounded-2xl mb-5 group-hover:bg-[var(--primary)]/20 transition">
                <Users className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">User Directory</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Browse every member's public profile and click straight to their social platforms — Instagram, GitHub, LinkedIn and more.
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                Explore Directory <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Q&A card */}
          <Link
            href="/questions"
            className="group relative overflow-hidden bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:bg-emerald-500/10 transition" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-500/10 rounded-2xl mb-5 group-hover:bg-emerald-500/20 transition">
                <MessageSquare className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Q&amp;A Community</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Ask questions, share knowledge, and get answers from the community. Attach files to make your questions clearer.
              </p>
              <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                View Questions <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        {/* 3 mini feature tiles */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Globe, color: 'text-blue-400 bg-blue-400/10', title: 'Public Profiles', desc: 'Share all your social links in one beautiful profile page anyone can visit.' },
            { icon: MessageSquare, color: 'text-emerald-400 bg-emerald-400/10', title: 'Q&A Platform', desc: 'Ask questions and get answers from the community with file attachment support.' },
            { icon: Shield, color: 'text-violet-400 bg-violet-400/10', title: 'Secure & Private', desc: 'Your data stays safe with bcrypt-hashed passwords and JWT-based auth.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[var(--foreground)] mb-2">{title}</h4>
              <p className="text-[var(--muted-foreground)] text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
