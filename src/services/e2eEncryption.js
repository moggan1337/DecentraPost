import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

async function getSharedSecret(username1, username2) {
  const sortedUsernames = [username1, username2].sort();
  const combined = sortedUsernames.join('-');
  
  const hash = crypto.createHash('sha256').update(combined).digest();
  return hash;
}

export async function encryptDM(content, recipientUsername) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const sharedSecret = await getSharedSecret('current_user', recipientUsername);
  
  const key = Buffer.from(sharedSecret);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    content: encrypted,
    tag: tag.toString('hex')
  };
}

export async function decryptDM(encryptedData, recipientUsername) {
  const { iv, content, tag } = encryptedData;
  
  if (!iv || !content || !tag) {
    throw new Error('Invalid encrypted data format');
  }
  
  const sharedSecret = await getSharedSecret('current_user', recipientUsername);
  
  const key = Buffer.from(sharedSecret);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function deriveKeyFromPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
}

export function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}
