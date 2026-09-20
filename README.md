# SocialHub

A full-stack web application featuring a public social profile directory and Q&A platform. Users can create profiles with social media links, ask questions, and share knowledge with file attachments.

## Features

- **User Authentication**: Sign up/login with email/password or Google OAuth
- **Public Profiles**: Create customizable profiles with social media links (Instagram, LinkedIn, GitHub, Twitter, YouTube, TikTok, and custom links)
- **User Directory**: Browse and search all public profiles with platform filtering
- **Q&A Platform**: Ask questions, post answers, and attach files (PDF, DOCX, XLSX, PNG, JPG, ZIP)
- **File Storage**: Secure file uploads via Vercel Blob storage
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Toast notifications for all user actions

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with raw SQL queries (pg library)
- **Authentication**: NextAuth.js (Auth.js)
- **File Storage**: Vercel Blob storage
- **Deployment**: Vercel

## Project Structure

```
socialhub/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # User dashboard
│   │   ├── directory/      # Public user directory
│   │   ├── questions/      # Q&A section
│   │   ├── u/[username]/   # Individual profile pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── header.tsx      # Navigation header
│   │   ├── footer.tsx      # Footer
│   │   ├── providers.tsx   # Session and toast providers
│   │   └── theme-provider.tsx # Dark mode toggle
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── db.ts           # Database connection
│   │   └── utils.ts        # Helper functions
│   ├── db/                 # Database schema
│   │   └── schema.sql      # SQL schema definition
│   └── scripts/            # Utility scripts
│       └── init-db.ts      # Database initialization
├── public/                 # Static assets
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud-hosted)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd socialhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/socialhub
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id  # Optional
   GOOGLE_CLIENT_SECRET=your-google-client-secret  # Optional
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb socialhub
   
   # Run schema initialization
   npx tsx src/scripts/init-db.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The application uses PostgreSQL with raw SQL queries. The schema is defined in `src/db/schema.sql`.

To initialize the database with sample data:
```bash
npx tsx src/scripts/init-db.ts
```

This will create:
- Users table with sample users
- Social links table with sample links
- Questions and answers tables with sample Q&A
- Attachments table structure

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

### Vercel Blob Storage Setup

1. Install Vercel CLI (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. Link your project to Vercel
   ```bash
   vercel link
   ```

3. Create a Blob store
   ```bash
   vercel blob create
   ```

4. Add the `BLOB_READ_WRITE_TOKEN` to your environment variables

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (set to your production URL)
     - `NEXTAUTH_SECRET`
     - `GOOGLE_CLIENT_ID` (optional)
     - `GOOGLE_CLIENT_SECRET` (optional)
     - `BLOB_READ_WRITE_TOKEN`
   - Click "Deploy"

3. **Set up production database**
   - Use Vercel Postgres, Neon, or any PostgreSQL hosting
   - Run the schema initialization on your production database
   - Update `DATABASE_URL` in Vercel environment variables

4. **Configure Google OAuth for production**
   - Add your production URL to authorized redirect URIs
   - Update environment variables in Vercel

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/[...nextauth]` - NextAuth authentication endpoint

### Users
- `GET /api/users` - List all users (paginated, searchable)
- `GET /api/users/[username]` - Get single user profile
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update own profile

### Social Links
- `POST /api/social-links` - Add new social link
- `PATCH /api/social-links/[id]` - Edit social link
- `DELETE /api/social-links/[id]` - Remove social link

### Questions & Answers
- `GET /api/questions` - List questions (paginated, searchable)
- `POST /api/questions` - Create new question
- `GET /api/questions/[id]` - Get question with answers
- `DELETE /api/questions/[id]` - Delete question (owner only)
- `POST /api/questions/[id]/answers` - Post answer
- `DELETE /api/answers/[id]` - Delete answer (owner only)

### File Uploads
- `POST /api/uploads` - Upload files to Vercel Blob

## File Upload Constraints

- **Allowed file types**: PDF, DOCX, XLSX, PNG, JPG, ZIP
- **Maximum file size**: 10MB per file
- **Maximum files per upload**: 5 files
- **Security**: MIME type validation, executable file rejection

## Security Features

- Password hashing with bcrypt
- URL validation to prevent XSS attacks
- File type validation (MIME type + extension)
- Rate limiting ready (implement as needed)
- Owner-only delete operations
- Session-based authentication

## Sample Data

The initialization script creates:
- 3 sample users with avatars
- 7 sample social links across platforms
- 3 sample questions
- 3 sample answers

Sample user credentials (for testing):
- Email: alice@example.com, Password: password123
- Email: bob@example.com, Password: password123
- Email: carol@example.com, Password: password123

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` format
- Verify database exists

### Authentication Issues
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Ensure Google OAuth redirect URIs are correct

### File Upload Issues
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check file size doesn't exceed 10MB
- Ensure file type is in allowed list

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
