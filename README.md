# DecentraPost

<p align="center">
  <img src="https://img.shields.io/badge/ActivityPub-Federated-C70039?style=for-the-badge&logo=mastodon&logoColor=white" alt="ActivityPub">
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-AGPL--3.0-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome">
</p>

> 🌍 **Federated Social Network** — End-to-end encrypted, ad-free, privacy-first social network compatible with Mastodon and the broader Fediverse via ActivityPub.

## About

DecentraPost is a next-generation decentralized social network that puts users back in control of their data and conversations. Built on the ActivityPub protocol, it federates seamlessly with Mastodon, Pixelfed, and other Fediverse platforms — while offering modern features like end-to-end encrypted direct messages, AI-powered content moderation, and zero advertising.

**Who it's for:**
- Privacy-conscious users who want control over their data
- Communities seeking an ad-free, algorithmic-free social experience
- Organizations needing a self-hostable social platform
- Users who want to communicate across different Fediverse instances

## Features

### Core Platform
| Feature | Description |
|---------|-------------|
| 📝 **Posts** | Text, images, videos, polls, and long-form articles |
| 🔗 **Federation** | Full ActivityPub support — connect with Mastodon, Pixelfed, and 10,000+ other instances |
| 🔒 **E2E Encryption** | Private messages encrypted end-to-end using public-key cryptography |
| 👥 **Social Graph** | Followers/following, blocks, mutes, and lists |
| 🔔 **Notifications** | Real-time notifications via WebSocket |
| 🔍 **Discovery** | Trending posts, hashtags, and profile discovery |

### Privacy & Security
| Feature | Description |
|---------|-------------|
| 🚫 **No Ads** | Completely ad-free — your attention is not for sale |
| 🔐 **Privacy Controls** | Granular post visibility (public, unlisted, followers-only, direct) |
| 🗑️ **Data Portability** | Export all your data in JSON format |
| 🔑 **Key Management** | User-controlled encryption keys via WebCrypto API |
| 🏳️ **Zero Tracking** | No analytics, no cookies, no fingerprinting |

### Moderation
| Feature | Description |
|---------|-------------|
| 🛡️ **AI Moderation** | AI-powered content flagging for harmful material |
| 🚫 **Block/Domain Block** | User-level and server-level blocking |
| 📋 **Admin Tools** | Comprehensive moderation dashboard for instance admins |
| 🔨 **Appeal System** | Users can contest moderation decisions |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DecentraPost Architecture                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Frontend                              │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Web App (Next.js 14)                               │ │   │
│  │  │  • PWA with offline support                         │ │   │
│  │  │  • Responsive design                               │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Native Mobile (React Native) - Future              │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────┴──────────────────────────────┐   │
│  │                  API Server (Node.js + Fastify)          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  ActivityPub Server Implementation                  │  │   │
│  │  │  • Inbox/Outbox message handling                   │  │   │
│  │  │  • WebFinger endpoint for identity resolution       │  │   │
│  │  │  • Federated user/search (SSB compatibility)        │  │   │
│  │  │  • LD+JSON / HTML profile pages                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────┴──────────────────────────────┐   │
│  │                      Services Layer                        │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │   │
│  │  │   Post    │ │   User    │ │   Media   │ │  Crypto   │  │   │
│  │  │  Service  │ │  Service  │ │  Service  │ │  Service  │  │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────┴──────────────────────────────┐   │
│  │                      Storage Layer                        │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │   │
│  │  │ PostgreSQL│ │   Redis   │ │  S3/MinIO │ │   Matrix  │  │   │
│  │  │ (Primary) │ │  (Cache)  │ │  (Media)  │ │ (E2E DM)  │  │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 19, TypeScript 5.5, Tailwind CSS |
| **API Server** | Node.js 20+, Fastify, ActivityPub.js |
| **Database** | PostgreSQL 15, Redis 7 |
| **Media Storage** | S3-compatible (MinIO for self-hosting) |
| **E2E Messages** | Matrix Protocol |
| **Encryption** | WebCrypto API, libsodium |
| **Real-time** | WebSocket (ws library) |

## Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- S3-compatible storage (or MinIO for local development)
- pnpm (recommended) or npm

### Steps

```bash
# Clone the repository
git clone https://github.com/moggan1337/DecentraPost.git
cd DecentraPost

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables
# Edit .env with your database, Redis, and S3 credentials

# Initialize the database
pnpm run db:migrate

# Start development server
pnpm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection string | ✅ |
| `S3_ENDPOINT` | S3/MinIO endpoint URL | ✅ |
| `S3_BUCKET` | S3 bucket name for media | ✅ |
| `S3_ACCESS_KEY` | S3 access key | ✅ |
| `S3_SECRET_KEY` | S3 secret key | ✅ |
| `DOMAIN` | Your instance domain | ✅ |
| `ADMIN_EMAIL` | Admin contact email | ✅ |

## Quick Start

### 1. Create an Account

Visit `http://localhost:3000` and register your account.

### 2. Follow Users from Other Instances

Use the search bar with `@username@domain.tld` format to find and follow users on other Fediverse instances.

### 3. Post Content

Create posts with text, images, polls, or articles. Choose visibility: Public, Unlisted, Followers-only, or Direct.

### 4. Send Encrypted Messages

Start a direct message and enable end-to-end encryption for private conversations.

## API Reference

### Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/statuses/:id` | Get a status by ID |
| `POST` | `/api/v1/statuses` | Create a new status |
| `DELETE` | `/api/v1/statuses/:id` | Delete a status |
| `GET` | `/api/v1/statuses/:id/context` | Get context for a status |

### Timelines

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/timelines/home` | Home timeline |
| `GET` | `/api/v1/timelines/public` | Public timeline |
| `GET` | `/api/v1/timelines/tag/:hashtag` | Hashtag timeline |

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/accounts/:id` | Get account info |
| `POST` | `/api/v1/accounts/:id/follow` | Follow an account |
| `POST` | `/api/v1/accounts/:id/unfollow` | Unfollow an account |
| `GET` | `/api/v1/accounts/:id/statuses` | Get account's statuses |

### ActivityPub (Federation)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/.well-known/webfinger` | WebFinger endpoint |
| `GET` | `/users/:username` | Actor JSON-LD |
| `POST` | `/users/:username/inbox` | Inbox for federated messages |
| `GET` | `/users/:username/outbox` | Outbox for federated posts |

## Encryption

DecentraPost uses end-to-end encryption for direct messages using a combination of RSA-OAEP for key exchange and AES-GCM for message encryption.

### Encrypting a Direct Message

```typescript
import { CryptoService } from './services/cryptoService';

// Encrypt message for recipient
const encrypted = await cryptoService.encryptMessage(
  messageContent,
  recipientPublicKey
);

// Decrypt received message
const decrypted = await cryptoService.decryptMessage(
  encrypted ciphertext,
  userPrivateKey
);
```

### Signing Content for Authenticity

```typescript
// Sign a post for authenticity
const signed = await cryptoService.signContent(
  postContent,
  userPrivateKey
);

// Verify signature
const isValid = await cryptoService.verifySignature(
  signedContent,
  authorPublicKey
);
```

## Deployment

### Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

```bash
# Build for production
pnpm run build

# Start production server
pnpm start
```

## Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting PRs.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/<your-username>/DecentraPost.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "Add: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Style Guide

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier)
- Write tests for new features
- Update documentation for API changes

## License

AGPLv3 License — See [LICENSE](LICENSE)

Copyright © 2024 DecentraPost Contributors

---

<p align="center">
  <sub>Built with ❤️ for a decentralized future</sub>
</p>
