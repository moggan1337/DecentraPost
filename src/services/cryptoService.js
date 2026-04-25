import crypto from 'crypto';

const ALGORITHM = 'rsa-sha256';
const KEY_LENGTH = 2048;

export async function generateKeyPair() {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: KEY_LENGTH,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) reject(err);
      else {
        const salt = crypto.randomBytes(32).toString('hex');
        resolve({ publicKey, privateKey, salt });
      }
    });
  });
}

export async function publicKeyToPem(publicKey) {
  if (typeof publicKey === 'string') {
    return publicKey;
  }
  return publicKey.export({ type: 'spki', format: 'pem' });
}

export async function privateKeyToPem(privateKey) {
  if (typeof privateKey === 'string') {
    return privateKey;
  }
  return privateKey.export({ type: 'pkcs8', format: 'pem' });
}

export function signData(data, privateKey) {
  const sign = crypto.createSign(ALGORITHM);
  sign.update(data);
  return sign.sign(privateKey, 'base64');
}

export function verifySignature(data, signature, publicKey) {
  const verify = crypto.createVerify(ALGORITHM);
  verify.update(data);
  return verify.verify(publicKey, signature, 'base64');
}
