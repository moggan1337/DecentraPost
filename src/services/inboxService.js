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

export async function processInboxActivity(username, activity) {
  console.log(`Processing inbox activity for ${username}: ${activity.type}`);
  
  switch (activity.type) {
    case 'Follow':
      await handleFollow(username, activity);
      break;
    case 'Accept':
      await handleAccept(activity);
      break;
    case 'Reject':
      await handleReject(activity);
      break;
    case 'Create':
      await handleCreate(username, activity);
      break;
    case 'Delete':
      await handleDelete(activity);
      break;
    case 'Announce':
      await handleAnnounce(username, activity);
      break;
    case 'Like':
      await handleLike(username, activity);
      break;
    default:
      console.log(`Unknown activity type: ${activity.type}`);
  }
  
  await storeInboxActivity(username, activity);
}

async function handleFollow(username, activity) {
  console.log(`Follow request from ${activity.actor} to ${username}`);
}

async function handleAccept(username, activity) {
  console.log(`Accept activity: ${activity.id}`);
}

async function handleReject(username, activity) {
  console.log(`Reject activity: ${activity.id}`);
}

async function handleCreate(username, activity) {
  console.log(`Create activity in ${username}'s inbox`);
}

async function handleDelete(activity) {
  console.log(`Delete activity: ${activity.id}`);
}

async function handleAnnounce(username, activity) {
  console.log(`Announce (boost) activity in ${username}'s inbox`);
}

async function handleLike(username, activity) {
  console.log(`Like activity in ${username}'s inbox`);
}

async function storeInboxActivity(username, activity) {
  try {
    await pool.query(
      `INSERT INTO inbox_activities (username, activity_id, activity_type, activity_data, received_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [username, activity.id, activity.type, JSON.stringify(activity)]
    );
  } catch (error) {
    console.error('Failed to store inbox activity:', error);
  }
}
