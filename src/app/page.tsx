import Link from 'next/link';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to SocialHub
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Connect with others through public profiles and share knowledge through questions and answers
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Link
              href="/directory"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">User Directory</h2>
              <p className="text-gray-600 mb-4">
                Discover and connect with people in our community. Browse profiles and find your social links.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                Explore Directory
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>

            <Link
              href="/questions"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto group-hover:bg-green-200 transition-colors">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Q&A Section</h2>
              <p className="text-gray-600 mb-4">
                Ask questions, share knowledge, and help others. Attach files to your questions and answers.
              </p>
              <div className="flex items-center justify-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                View Questions
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-medium mb-2">Public Profiles</h4>
                <p className="text-gray-600 text-sm">
                  Create your profile with social links to Instagram, LinkedIn, GitHub, and more
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Q&A Platform</h4>
                <p className="text-gray-600 text-sm">
                  Ask questions and get answers from the community with file attachments
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Easy Discovery</h4>
                <p className="text-gray-600 text-sm">
                  Search and filter users by platform, browse questions by topic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
