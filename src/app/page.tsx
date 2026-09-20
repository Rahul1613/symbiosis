import Link from 'next/link';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to SocialHub
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-12">
            Connect with others through public profiles and share knowledge through questions and answers
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Link
              href="/directory"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4 mx-auto group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">User Directory</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover and connect with people in our community. Browse profiles and find your social links.
              </p>
              <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                Explore Directory
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>

            <Link
              href="/questions"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 mx-auto group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Q&A Section</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ask questions, share knowledge, and help others. Attach files to your questions and answers.
              </p>
              <div className="flex items-center justify-center text-green-600 dark:text-green-400 font-medium group-hover:translate-x-2 transition-transform">
                View Questions
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Features</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Public Profiles</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create your profile with social links to Instagram, LinkedIn, GitHub, and more
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Q&A Platform</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ask questions and get answers from the community with file attachments
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Easy Discovery</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
