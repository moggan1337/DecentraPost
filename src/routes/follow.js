import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../services/followService.js';

export const followRoutes = Router();

followRoutes.post('/follow', authenticate, async (req, res, next) => {
  try {
    const { targetUsername } = req.body;
    
    if (!targetUsername) {
      return res.status(400).json({ error: 'targetUsername is required' });
    }
    
    if (targetUsername === req.user.username) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const follow = await followUser(req.user.username, targetUsername);
    
    res.status(201).json(follow);
  } catch (error) {
    next(error);
  }
});

followRoutes.post('/unfollow', authenticate, async (req, res, next) => {
  try {
    const { targetUsername } = req.body;
    
    if (!targetUsername) {
      return res.status(400).json({ error: 'targetUsername is required' });
    }
    
    await unfollowUser(req.user.username, targetUsername);
    
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

followRoutes.get('/:username/followers', async (req, res, next) => {
  try {
    const { username } = req.params;
    const followers = await getFollowers(username);
    
    res.json(followers);
  } catch (error) {
    next(error);
  }
});

followRoutes.get('/:username/following', async (req, res, next) => {
  try {
    const { username } = req.params;
    const following = await getFollowing(username);
    
    res.json(following);
  } catch (error) {
    next(error);
  }
});

followRoutes.post('/accept', authenticate, async (req, res, next) => {
  try {
    const { followId } = req.body;
    
    const result = await acceptFollow(followId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

async function acceptFollow(followId) {
  return { id: followId, status: 'accepted' };
}
