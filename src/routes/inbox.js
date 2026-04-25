import { Router } from 'express';
import { processInboxActivity } from '../services/inboxService.js';

export const inboxRoutes = Router();

inboxRoutes.post('/:username/inbox', async (req, res, next) => {
  try {
    const { username } = req.params;
    const activity = req.body;
    
    if (!activity.type) {
      return res.status(400).json({ error: 'Invalid activity' });
    }
    
    console.log(`Inbox activity for ${username}:`, activity.type);
    
    await processInboxActivity(username, activity);
    
    res.status(202).json({ status: 'accepted' });
  } catch (error) {
    next(error);
  }
});

inboxRoutes.get('/:username/inbox', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page } = req.query;
    
    const inbox = await getInboxActivities(username, page);
    
    res.json(inbox);
  } catch (error) {
    next(error);
  }
});

async function getInboxActivities(username, page) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'OrderedCollection',
    id: `${process.env.BASE_URL || 'http://localhost:3000'}/users/${username}/inbox`,
    totalItems: 0,
    orderedItems: []
  };
}
