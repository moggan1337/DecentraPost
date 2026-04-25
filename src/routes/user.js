import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { getUserByUsername, createUser, getUserById } from '../services/userService.js';
import { generateKeyPair, publicKeyToPem } from '../services/cryptoService.js';

export const userRoutes = Router();

userRoutes.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
    }
    
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const keyPair = await generateKeyPair();
    
    const user = await createUser({
      id: uuidv4(),
      username,
      email,
      passwordHash: hashedPassword,
      displayName: displayName || username,
      publicKey: await publicKeyToPem(keyPair.publicKey),
      privateKey: keyPair.privateKey,
      salt: keyPair.salt
    });
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    const actor = await buildActorObject(user);
    
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName
      },
      token,
      actor
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName
      }
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const actor = await buildActorObject(user);
    res.json(actor);
  } catch (error) {
    next(error);
  }
});

async function buildActorObject(user) {
  const domain = config.baseUrl.replace('http://', '').replace('https://', '');
  
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1'
    ],
    id: `${config.baseUrl}/users/${user.username}`,
    type: 'Person',
    preferredUsername: user.username,
    name: user.displayName,
    summary: `DecentraPost user ${user.username}`,
    url: `${config.baseUrl}/users/${user.username}`,
    inbox: `${config.baseUrl}/users/${user.username}/inbox`,
    outbox: `${config.baseUrl}/users/${user.username}/outbox`,
    followers: `${config.baseUrl}/users/${user.username}/followers`,
    following: `${config.baseUrl}/users/${user.username}/following`,
    publicKey: {
      id: `${config.baseUrl}/users/${user.username}#main-key`,
      owner: `${config.baseUrl}/users/${user.username}`,
      publicKeyPem: user.publicKey
    },
    endpoints: {
      sharedInbox: `${config.baseUrl}/inbox`
    },
    published: new Date().toISOString()
  };
}
