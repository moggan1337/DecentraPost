# DecentraPost Development Guide

## Project Overview
DecentraPost is a decentralized social platform implementing the ActivityPub protocol with end-to-end encryption for direct messages.

## Architecture
- **Framework**: Express.js with ES modules
- **Database**: PostgreSQL
- **Authentication**: JWT + ActivityPub signatures
- **Encryption**: AES-256-GCM for DMs

## Key Files
- `src/index.js` - Main entry point
- `src/routes/` - API endpoints
- `src/services/` - Business logic
- `src/middleware/` - Auth & federation middleware

## ActivityPub Implementation
- Actors are represented as JSON-LD objects
- Inbox/Outbox for activity delivery
- WebFinger for user discovery
- HTTP Signatures for request verification

## E2E Encryption Flow
1. User registers → key pair generated (RSA-2048)
2. DM sent → AES-256-GCM encryption with shared secret
3. DM received → decryption using recipient's key

## Running Locally
```bash
npm install
npm run migrate
npm start
```

## Environment Variables
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `BASE_URL`
- `PORT`
