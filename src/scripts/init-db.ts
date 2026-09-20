import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    console.log('Starting database initialization...');

    // Read and execute schema
    const schemaPath = join(process.cwd(), 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('Schema created successfully');

    // Check if we already have sample data
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('Sample data already exists, skipping seed');
      return;
    }

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        id: 'user_1',
        name: 'Alice Johnson',
        username: 'alicej',
        email: 'alice@example.com',
        password_hash: passwordHash,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        bio: 'Full-stack developer passionate about building great user experiences'
      },
      {
        id: 'user_2',
        name: 'Bob Smith',
        username: 'bobsmith',
        email: 'bob@example.com',
        password_hash: passwordHash,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        bio: 'Designer and creative thinker'
      },
      {
        id: 'user_3',
        name: 'Carol Williams',
        username: 'carolw',
        email: 'carol@example.com',
        password_hash: passwordHash,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
        bio: 'Tech enthusiast and open source contributor'
      }
    ];

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (id, name, username, email, password_hash, avatar_url, bio) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.id, user.name, user.username, user.email, user.password_hash, user.avatar_url, user.bio]
      );
    }
    console.log('Sample users created');

    // Create sample social links
    const socialLinks = [
      { id: 'link_1', user_id: 'user_1', platform: 'github', url: 'https://github.com/alicej', label: 'GitHub' },
      { id: 'link_2', user_id: 'user_1', platform: 'linkedin', url: 'https://linkedin.com/in/alicej', label: 'LinkedIn' },
      { id: 'link_3', user_id: 'user_1', platform: 'twitter', url: 'https://twitter.com/alicej', label: 'Twitter' },
      { id: 'link_4', user_id: 'user_2', platform: 'instagram', url: 'https://instagram.com/bobsmith', label: 'Instagram' },
      { id: 'link_5', user_id: 'user_2', platform: 'dribbble', url: 'https://dribbble.com/bobsmith', label: 'Dribbble' },
      { id: 'link_6', user_id: 'user_3', platform: 'youtube', url: 'https://youtube.com/@carolw', label: 'YouTube' },
      { id: 'link_7', user_id: 'user_3', platform: 'github', url: 'https://github.com/carolw', label: 'GitHub' },
    ];

    for (const link of socialLinks) {
      await pool.query(
        'INSERT INTO social_links (id, user_id, platform, url, label) VALUES ($1, $2, $3, $4, $5)',
        [link.id, link.user_id, link.platform, link.url, link.label]
      );
    }
    console.log('Sample social links created');

    // Create sample questions
    const questions = [
      {
        id: 'q_1',
        user_id: 'user_1',
        title: 'How do I get started with Next.js 14?',
        body: 'I\'m new to Next.js and want to build my first app. What are the best resources to get started with the App Router?'
      },
      {
        id: 'q_2',
        user_id: 'user_2',
        title: 'Best practices for responsive design in 2024?',
        body: 'What are the current best practices for building responsive websites? Should I use CSS Grid, Flexbox, or a combination?'
      },
      {
        id: 'q_3',
        user_id: 'user_3',
        title: 'How to handle file uploads in serverless environments?',
        body: 'I\'m building an app that needs to handle file uploads. What\'s the best approach for serverless deployments like Vercel?'
      }
    ];

    for (const question of questions) {
      await pool.query(
        'INSERT INTO questions (id, user_id, title, body) VALUES ($1, $2, $3, $4)',
        [question.id, question.user_id, question.title, question.body]
      );
    }
    console.log('Sample questions created');

    // Create sample answers
    const answers = [
      {
        id: 'a_1',
        question_id: 'q_1',
        user_id: 'user_3',
        body: 'I recommend starting with the official Next.js documentation. The App Router has great tutorials, and there\'s also the Learn Next.js course which is free and very comprehensive.'
      },
      {
        id: 'a_2',
        question_id: 'q_2',
        user_id: 'user_1',
        body: 'In 2024, I recommend using a combination of CSS Grid for layout and Flexbox for alignment. Mobile-first approach is still the way to go, and consider using container queries for more component-based responsive design.'
      },
      {
        id: 'a_3',
        question_id: 'q_3',
        user_id: 'user_1',
        body: 'For Vercel, I recommend using Vercel Blob storage. It\'s designed specifically for serverless environments and integrates seamlessly with Next.js. You can also consider using services like AWS S3 or Cloudflare R2.'
      }
    ];

    for (const answer of answers) {
      await pool.query(
        'INSERT INTO answers (id, question_id, user_id, body) VALUES ($1, $2, $3, $4)',
        [answer.id, answer.question_id, answer.user_id, answer.body]
      );
    }
    console.log('Sample answers created');

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

initDatabase();
