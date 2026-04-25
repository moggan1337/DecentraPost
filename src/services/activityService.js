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

export async function createActivity(activity) {
  const id = activity.id || `http://${config.baseUrl}/activities/${Date.now()}`;
  
  const result = await pool.query(
    `INSERT INTO activities (id, type, actor, object, target, summary, content, published, local)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id,
      activity.type,
      activity.actor,
      JSON.stringify(activity.object),
      activity.target || null,
      activity.summary || null,
      activity.content || null,
      activity.published || new Date().toISOString(),
      activity.local !== false
    ]
  );
  
  return result.rows[0];
}

export async function getActivityById(id) {
  const result = await pool.query(
    'SELECT * FROM activities WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function getActivitiesForActor(actor, limit = 20, offset = 0) {
  const result = await pool.query(
    `SELECT * FROM activities WHERE actor = $1 ORDER BY published DESC LIMIT $2 OFFSET $3`,
    [actor, limit, offset]
  );
  return result.rows;
}

export async function deleteActivity(id) {
  await pool.query('DELETE FROM activities WHERE id = $1', [id]);
}

export async function getTimelineForUser(username, limit = 20) {
  const result = await pool.query(
    `SELECT a.* FROM activities a
     INNER JOIN follows f ON a.actor = f.target_username
     WHERE f.follower_username = $1 AND a.type IN ('Create', 'Post')
     ORDER BY a.published DESC
     LIMIT $2`,
    [username, limit]
  );
  return result.rows;
}

export async function getActor(actorId) {
  return { id: actorId };
}
