import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cleanup() {
  const ids = ['user_1', 'user_2', 'user_3'];
  await pool.query(`DELETE FROM answers WHERE user_id = ANY($1)`, [ids]);
  await pool.query(`DELETE FROM questions WHERE user_id = ANY($1)`, [ids]);
  await pool.query(`DELETE FROM social_links WHERE user_id = ANY($1)`, [ids]);
  await pool.query(`DELETE FROM users WHERE id = ANY($1)`, [ids]);
  console.log('Demo data removed successfully');
  await pool.end();
}

cleanup();
