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

export async function createNote(username, noteData) {
  const id = `${config.baseUrl}/notes/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const result = await pool.query(
    `INSERT INTO notes (id, author_username, content, summary, published, url, local)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING *`,
    [
      id,
      username,
      noteData.content,
      noteData.summary || null,
      noteData.published || new Date().toISOString(),
      id
    ]
  );
  
  return result.rows[0];
}

export async function getNote(id) {
  const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function deleteNote(id, username) {
  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 AND author_username = $2 RETURNING *',
    [id, username]
  );
  return result.rows[0];
}

export async function getOutboxActivities(username, page = 1) {
  const pageSize = config.activitypub.outboxPageSize;
  const offset = (page - 1) * pageSize;
  
  const result = await pool.query(
    `SELECT * FROM activities WHERE actor = $1 ORDER BY published DESC LIMIT $2 OFFSET $3`,
    [`${config.baseUrl}/users/${username}`, pageSize, offset]
  );
  
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM activities WHERE actor = $1',
    [`${config.baseUrl}/users/${username}`]
  );
  
  const totalItems = parseInt(countResult.rows[0].count);
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'OrderedCollection',
    id: `${config.baseUrl}/users/${username}/outbox`,
    totalItems,
    orderedItems: result.rows
  };
}

export async function getPublicTimeline(limit = 20) {
  const result = await pool.query(
    `SELECT a.* FROM activities a
     INNER JOIN users u ON a.actor = u.username
     WHERE a.local = true AND a.type = 'Create'
     ORDER BY a.published DESC
     LIMIT $1`,
    [limit]
  );
  
  return result.rows;
}
