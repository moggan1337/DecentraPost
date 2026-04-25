# DecentraPost

Decentralized social platform with ActivityPub protocol and end-to-end encryption.

## Features

- **ActivityPub Protocol**: Full federation with Mastodon, Pixelfed, and other ActivityPub-compatible platforms
- **End-to-End Encryption**: Secure DMs using AES-256-GCM with shared secret derivation
- **Decentralized Identity**: WebFinger and ActivityStreams for user discovery
- **JWT Authentication**: Secure session management with JSON Web Tokens
- **RSA Key Pairs**: Per-user cryptographic identities for message signing

## Tech Stack

- Node.js + Express.js
- PostgreSQL
- Crypto-JS (AES-256-GCM)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
npm install
```

### Database Setup

```bash
# Create PostgreSQL database
createdb decentrapost

# Run migrations
npm run migrate
```

### Configuration

Create a `.env` file:

```env
PORT=3000
BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=decentrapost
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

### Running

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - Login

### ActivityPub
- `GET /.well-known/webfinger` - User discovery
- `GET /users/:username` - Get actor object
- `POST /users/:username/inbox` - Receive activities
- `POST /users/:username/outbox` - Post activities
- `GET /users/:username/followers` - Get followers
- `GET /users/:username/following` - Get following

### Direct Messages
- `POST /dm/send` - Send encrypted DM
- `GET /dm/conversations` - List conversations
- `GET /dm/messages/:id` - Get messages

## Activity Types Supported

- `Follow` - Follow a user
- `Accept` - Accept a follow request
- `Reject` - Reject a follow request
- `Create` - Create a note
- `Delete` - Delete content
- `Announce` - Boost/Share
- `Like` - Like content

## Security

- All DMs are encrypted with AES-256-GCM
- Shared secrets derived from user pair using SHA-256
- HTTP Signatures for federation verification
- Password hashing with bcrypt (cost factor 12)

## License

MIT
