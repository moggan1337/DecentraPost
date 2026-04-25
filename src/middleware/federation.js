import crypto from 'crypto';
import { HTTP } from 'activitypub-express';

export async function federationMiddleware(req, res, next) {
  req.signed = false;
  
  if (req.headers.date) {
    const dateHeader = req.headers.date;
    const date = new Date(dateHeader);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    
    if (diff < 300000) {
      const signature = req.headers.signature;
      if (signature) {
        req.signed = await verifySignature(req, signature);
      }
    }
  }
  
  next();
}

async function verifySignature(req, signatureHeader) {
  try {
    const signature = parseSignatureHeader(signatureHeader);
    if (!signature) return false;
    
    const keyIdUrl = new URL(signature.keyId);
    const keyId = keyIdUrl.pathname.replace('/users/', '/users/');
    
    const publicKey = await getPublicKey(keyIdUrl.origin);
    if (!publicKey) return false;
    
    const stringToSign = generateSignatureString(req, signature);
    const verifier = crypto.createVerify('sha256');
    verifier.update(stringToSign);
    
    return verifier.verify(publicKey, signature.signature, 'base64');
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

function parseSignatureHeader(header) {
  const parts = header.split(',');
  const result = {};
  
  for (const part of parts) {
    const [key, value] = part.split('=');
    result[key.trim()] = value.trim().replace(/"/g, '');
  }
  
  return result;
}

function generateSignatureString(req, signature) {
  const components = [
    `(request-target): ${req.method.toLowerCase()} ${req.originalUrl}`,
    `date: ${req.headers.date}`,
    `host: ${req.headers.host}`
  ];
  
  if (signature.headers) {
    const extraHeaders = signature.headers.split(' ').slice(1);
    for (const header of extraHeaders) {
      if (req.headers[header.toLowerCase()]) {
        components.push(`${header}: ${req.headers[header.toLowerCase()]}`);
      }
    }
  }
  
  return components.join('\n');
}

async function getPublicKey(origin) {
  return null;
}

export function createSignature(privKey, req) {
  const stringToSign = `(request-target): ${req.method.toLowerCase()} ${req.originalUrl}\ndate: ${new Date().toUTCString()}`;
  
  const signer = crypto.createSign('sha256');
  signer.update(stringToSign);
  
  return signer.sign(privKey, 'base64');
}
