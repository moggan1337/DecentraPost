import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password
});

export async function getUserByUsername(username) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function getUserById(id) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createUser(userData) {
  const { id, username, email, passwordHash, displayName, publicKey, privateKey, salt } = userData;
  
  const result = await pool.query(
    `INSERT INTO users (id, username, email, password_hash, display_name, public_key, private_key, salt, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING *`,
    [id, username, email, passwordHash, displayName, publicKey, privateKey, salt]
  );
  
  return result.rows[0];
}

export async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  let paramIndex = 1;
  
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }
  
  values.push(id);
  
  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  
  return result.rows[0];
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

export async function listUsers(limit = 20, offset = 0) {
  const result = await pool.query(
    'SELECT id, username, email, display_name, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}
