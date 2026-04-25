import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { activityRoutes } from './routes/activity.js';
import { userRoutes } from './routes/user.js';
import { inboxRoutes } from './routes/inbox.js';
import { outboxRoutes } from './routes/outbox.js';
import { followRoutes } from './routes/follow.js';
import { dmRoutes } from './routes/dm.js';
import { federationMiddleware } from './middleware/federation.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

app.use('/activity', federationMiddleware, activityRoutes);
app.use('/users', userRoutes);
app.use('/inbox', inboxRoutes);
app.use('/outbox', outboxRoutes);
app.use('/follow', followRoutes);
app.use('/dm', dmRoutes);

app.get('/.well-known/webfinger', async (req, res) => {
  const resource = req.query.resource;
  if (!resource) {
    return res.status(400).json({ error: 'resource parameter required' });
  }
  
  const acct = resource.replace('acct:', '');
  const [username, domain] = acct.split('@');
  
  res.json({
    subject: resource,
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `${config.baseUrl}/users/${username}`
      }
    ]
  });
});

app.get('/.well-known/nodeinfo', (req, res) => {
  res.json({
    links: [
      { rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1', href: `${config.baseUrl}/nodeinfo/2.1` }
    ]
  });
});

app.get('/nodeinfo/2.1', (req, res) => {
  res.json({
    version: '2.1',
    software: { name: 'DecentraPost', version: '1.0.0' },
    protocols: ['activitypub'],
    usage: { users: { total: 0 }, localPosts: 0 }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`DecentraPost server running on port ${PORT}`);
  console.log(`ActivityPub endpoint: ${config.baseUrl}`);
});

export default app;
