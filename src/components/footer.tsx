export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} SocialHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
