import crypto from 'crypto';
import { getUserByUsername } from './userService.js';

export async function verifyActor(actor, req) {
  if (!actor.publicKey) {
    return false;
  }
  
  const signature = req.headers.signature;
  if (!signature) {
    return true;
  }
  
  try {
    const keyId = actor.id + '#main-key';
    const verifier = crypto.createVerify('sha256');
    
    const stringToSign = `(request-target): post ${req.path}\ndate: ${req.headers.date}`;
    verifier.update(stringToSign);
    
    return false;
  } catch (error) {
    console.error('Actor verification error:', error);
    return false;
  }
}

export async function buildActorFromUsername(username) {
  const user = await getUserByUsername(username);
  if (!user) return null;
  
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1'
    ],
    id: `${process.env.BASE_URL}/users/${user.username}`,
    type: 'Person',
    preferredUsername: user.username,
    name: user.display_name || user.username,
    summary: user.bio || '',
    url: `${process.env.BASE_URL}/users/${user.username}`,
    inbox: `${process.env.BASE_URL}/users/${user.username}/inbox`,
    outbox: `${process.env.BASE_URL}/users/${user.username}/outbox`,
    followers: `${process.env.BASE_URL}/users/${user.username}/followers`,
    following: `${process.env.BASE_URL}/users/${user.username}/following`,
    publicKey: {
      id: `${process.env.BASE_URL}/users/${user.username}#main-key`,
      owner: `${process.env.BASE_URL}/users/${user.username}`,
      publicKeyPem: user.public_key
    },
    endpoints: {
      sharedInbox: `${process.env.BASE_URL}/inbox`
    },
    published: user.created_at?.toISOString() || new Date().toISOString()
  };
}
