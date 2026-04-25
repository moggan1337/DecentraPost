import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getActor, createActivity } from '../services/activityService.js';
import { verifyActor } from '../services/actorService.js';

export const activityRoutes = Router();

activityRoutes.post('/', async (req, res, next) => {
  try {
    const activity = req.body;
    
    if (!activity.type || !activity.id) {
      return res.status(400).json({ error: 'Invalid activity object' });
    }
    
    const actor = await getActor(activity.actor);
    if (!actor) {
      return res.status(401).json({ error: 'Unknown actor' });
    }
    
    const valid = await verifyActor(actor, req);
    if (!valid) {
      return res.status(403).json({ error: 'Signature verification failed' });
    }
    
    const savedActivity = await createActivity(activity);
    
    await deliverToInbox(activity);
    
    res.status(201).json(savedActivity);
  } catch (error) {
    next(error);
  }
});

activityRoutes.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await getActivityById(id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

async function deliverToInbox(activity) {
  console.log('Delivering activity to inboxes:', activity.id);
}

async function getActivityById(id) {
  return null;
}
