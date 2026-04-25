# DecentraPost

<p align="center">
  <img src="https://img.shields.io/badge/ActivityPub-Federated-C70039?style=for-the-badge&logo=mastodon&logoColor=white" alt="ActivityPub">
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

> 🌍 **Federated Social Network** - End-to-end encrypted, ad-free, privacy-first social network compatible with Mastodon and ActivityPub.

## ✨ Features

### Core Platform
- 📝 **Posts** - Text, images, videos, polls, articles
- 🔗 **Federation** - Full ActivityPub support, connect with Mastodon
- 🔒 **E2E Encryption** - Private messages encrypted end-to-end
- 👥 **Followers/Following** - Standard social graph
- 🔔 **Notifications** - Real-time notifications
- 🔍 **Discovery** - Trending posts, hashtags, profiles

### Privacy
- 🚫 **No Ads** - Completely ad-free
- 🔐 **Privacy Controls** - Granular post visibility
- 🗑️ **Data Portability** - Export all your data
- 🔑 **Key Management** - User-controlled encryption keys
- 🏳️ **No Tracking** - No analytics, no cookies

### Moderation
- 🛡️ **Content Moderation** - AI-powered content flagging
- 🚫 **Block/Domain Block** - User and server blocking
- 📋 **Moderation Tools** - For admins and users
- 🔨 **Appeal System** - Moderation decision appeals

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DecentraPost Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Frontend (React/Next.js)              │   │
│  │  - Web App                                                   │   │
│  │  - PWA (Offline capable)                                     │   │
│  │  - Native (React Native - Future)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                    API Server (Node.js + Fastify)            │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ ActivityPub Server Implementation                      │   │ │
│  │  │ - Inbox/Outbox                                        │   │ │
│  │  │ - Federation                                          │   │ │
│  │  │ - WebFinger                                           │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                    Services                                  │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ │ │
│  │  │  Post     │ │  User    │ │  Media   │ │   Crypto   │ │ │
│  │  │  Service  │ │  Service  │ │  Service  │ │   Service  │ │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                    Storage                                  │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ │ │
│  │  │ PostgreSQL│ │  Redis   │ │  S3/MinIO │ │   Matrix    │ │ │
│  │  │ (Primary) │ │ (Cache)  │ │  (Media)  │ │ (Encrypted  │ │ │
│  │  │           │ │          │ │           │ │   Messages) │ │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Installation

```bash
git clone https://github.com/moggan1337/DecentraPost.git
cd DecentraPost

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Configure database, Redis, S3

# Initialize database
npm run db:migrate

# Start development
npm run dev
```

## 🔐 Encryption

```typescript
// E2E Encryption for Direct Messages
const encrypted = await cryptoService.encryptMessage(
  message,
  recipientPublicKey
);

// Sign posts for authenticity
const signed = await cryptoService.signContent(post, userPrivateKey);
```

## 📄 License

AGPLv3 License - See [LICENSE](LICENSE)
