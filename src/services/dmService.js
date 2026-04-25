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

export async function sendDM(messageData) {
  const { id, senderUsername, recipientUsername, encryptedContent, replyTo, createdAt } = messageData;
  
  const conversationId = generateConversationId(senderUsername, recipientUsername);
  
  const result = await pool.query(
    `INSERT INTO direct_messages (id, conversation_id, sender_username, recipient_username, encrypted_content, reply_to, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, conversationId, senderUsername, recipientUsername, JSON.stringify(encryptedContent), replyTo || null, createdAt]
  );
  
  return result.rows[0];
}

export async function getConversations(username) {
  const result = await pool.query(
    `SELECT 
       conversation_id,
       MAX(CASE WHEN sender_username = $1 THEN recipient_username ELSE sender_username END) as other_user,
       MAX(created_at) as last_message_at,
       MAX(id) FILTER (WHERE created_at = MAX(created_at)) as last_message_id
     FROM direct_messages
     WHERE sender_username = $1 OR recipient_username = $1
     GROUP BY conversation_id
     ORDER BY last_message_at DESC`,
    [username]
  );
  
  return result.rows.map(row => ({
    id: row.conversation_id,
    otherUser: row.other_user,
    lastMessageAt: row.last_message_at,
    lastMessageId: row.last_message_id
  }));
}

export async function getMessages(conversationId, username, limit = 50, offset = 0) {
  const result = await pool.query(
    `SELECT * FROM direct_messages
     WHERE conversation_id = $1 AND (sender_username = $2 OR recipient_username = $2)
     ORDER BY created_at DESC
     LIMIT $3 OFFSET $4`,
    [conversationId, username, limit, offset]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    senderUsername: row.sender_username,
    recipientUsername: row.recipient_username,
    encryptedContent: JSON.parse(row.encrypted_content || '{}'),
    replyTo: row.reply_to,
    createdAt: row.created_at
  }));
}

function generateConversationId(username1, username2) {
  const sorted = [username1, username2].sort();
  return sorted.join('-');
}
