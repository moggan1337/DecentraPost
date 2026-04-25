import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

async function migrate() {
  const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: 'postgres',
    user: config.database.user,
    password: config.database.password
  });
  
  try {
    const dbExists = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.database.name]
    );
    
    if (dbExists.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${config.database.name}`);
      console.log(`Database ${config.database.name} created`);
    }
  } catch (error) {
    console.log('Database may already exist:', error.message);
  } finally {
    await pool.end();
  }
  
  const appPool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password
  });
  
  try {
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        bio TEXT,
        public_key TEXT,
        private_key TEXT,
        salt VARCHAR(64),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Users table created');
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        actor VARCHAR(255) NOT NULL,
        object JSONB,
        target VARCHAR(255),
        summary VARCHAR(500),
        content TEXT,
        published TIMESTAMP,
        local BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Activities table created');
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id VARCHAR(255) PRIMARY KEY,
        follower_username VARCHAR(30) NOT NULL,
        target_username VARCHAR(30) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP,
        UNIQUE(follower_username, target_username)
      )
    `);
    console.log('Follows table created');
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS direct_messages (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(100) NOT NULL,
        sender_username VARCHAR(30) NOT NULL,
        recipient_username VARCHAR(30) NOT NULL,
        encrypted_content JSONB NOT NULL,
        reply_to VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Direct messages table created');
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id VARCHAR(255) PRIMARY KEY,
        author_username VARCHAR(30) NOT NULL,
        content TEXT NOT NULL,
        summary VARCHAR(500),
        published TIMESTAMP,
        url VARCHAR(255),
        local BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Notes table created');
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS inbox_activities (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        activity_id VARCHAR(255),
        activity_type VARCHAR(50),
        activity_data JSONB,
        received_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Inbox activities table created');
    
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_activities_actor ON activities(actor)`);
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_activities_published ON activities(published DESC)`);
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_username)`);
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_follows_target ON follows(target_username)`);
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_dm_conversation ON direct_messages(conversation_id)`);
    await appPool.query(`CREATE INDEX IF NOT EXISTS idx_inbox_username ON inbox_activities(username)`);
    
    console.log('Indexes created');
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await appPool.end();
  }
}

migrate().catch(console.error);
