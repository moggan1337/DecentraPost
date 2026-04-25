import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createNote, getOutboxActivities } from '../services/outboxService.js';
import { authenticate } from '../middleware/auth.js';

export const outboxRoutes = Router();

outboxRoutes.post('/:username/outbox', authenticate, async (req, res, next) => {
  try {
    const { username } = req.params;
    const activity = req.body;
    
    if (req.user.username !== username) {
      return res.status(403).json({ error: 'Cannot post to another user\'s outbox' });
    }
    
    const result = await createOutboxActivity(username, activity);
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

outboxRoutes.get('/:username/outbox', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page } = req.query;
    
    const outbox = await getOutboxActivities(username, page);
    
    res.json(outbox);
  } catch (error) {
    next(error);
  }
});

async function createOutboxActivity(username, activity) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  const fullActivity = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/activities/${uuidv4()}`,
    type: activity.type || 'Create',
    actor: `${baseUrl}/users/${username}`,
    published: new Date().toISOString(),
    object: activity.object || activity
  };
  
  console.log('Created outbox activity:', fullActivity.id);
  
  return fullActivity;
}
