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

export async function followUser(followerUsername, targetUsername) {
  const result = await pool.query(
    `INSERT INTO follows (id, follower_username, target_username, status, created_at)
     VALUES ($1, $2, $3, 'pending', NOW())
     ON CONFLICT (follower_username, target_username) DO NOTHING
     RETURNING *`,
    [generateId(), followerUsername, targetUsername]
  );
  
  return result.rows[0];
}

export async function unfollowUser(followerUsername, targetUsername) {
  await pool.query(
    'DELETE FROM follows WHERE follower_username = $1 AND target_username = $2',
    [followerUsername, targetUsername]
  );
}

export async function acceptFollow(followId) {
  const result = await pool.query(
    `UPDATE follows SET status = 'accepted', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [followId]
  );
  return result.rows[0];
}

export async function rejectFollow(followId) {
  await pool.query(
    "UPDATE follows SET status = 'rejected', updated_at = NOW() WHERE id = $1",
    [followId]
  );
}

export async function getFollowers(username, limit = 20, offset = 0) {
  const result = await pool.query(
    `SELECT f.*, u.display_name, u.public_key 
     FROM follows f
     INNER JOIN users u ON f.follower_username = u.username
     WHERE f.target_username = $1 AND f.status = 'accepted'
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [username, limit, offset]
  );
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'OrderedCollection',
    totalItems: result.rows.length,
    orderedItems: result.rows.map(row => ({
      type: 'Person',
      id: `${config.baseUrl}/users/${row.follower_username}`,
      name: row.display_name,
      preferredUsername: row.follower_username
    }))
  };
}

export async function getFollowing(username, limit = 20, offset = 0) {
  const result = await pool.query(
    `SELECT f.*, u.display_name, u.public_key 
     FROM follows f
     INNER JOIN users u ON f.target_username = u.username
     WHERE f.follower_username = $1 AND f.status = 'accepted'
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [username, limit, offset]
  );
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'OrderedCollection',
    totalItems: result.rows.length,
    orderedItems: result.rows.map(row => ({
      type: 'Person',
      id: `${config.baseUrl}/users/${row.target_username}`,
      name: row.display_name,
      preferredUsername: row.target_username
    }))
  };
}

function generateId() {
  return `${config.baseUrl}/follows/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
