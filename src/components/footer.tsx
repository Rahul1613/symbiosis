export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-[var(--muted-foreground)] text-sm">
          <p>&copy; {new Date().getFullYear()} SocialHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
