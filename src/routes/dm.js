import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';
import { encryptDM, decryptDM } from '../services/e2eEncryption.js';
import { sendDM, getConversations, getMessages } from '../services/dmService.js';

export const dmRoutes = Router();

dmRoutes.post('/send', authenticate, async (req, res, next) => {
  try {
    const { recipientUsername, content, replyTo } = req.body;
    
    if (!recipientUsername || !content) {
      return res.status(400).json({ error: 'recipientUsername and content are required' });
    }
    
    const encryptedContent = await encryptDM(content, recipientUsername);
    
    const message = await sendDM({
      id: uuidv4(),
      senderUsername: req.user.username,
      recipientUsername,
      encryptedContent,
      replyTo,
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json({
      id: message.id,
      recipientUsername,
      encrypted: true,
      createdAt: message.createdAt
    });
  } catch (error) {
    next(error);
  }
});

dmRoutes.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const conversations = await getConversations(req.user.username);
    
    const decryptedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = conv.lastMessage;
        if (lastMessage && lastMessage.encryptedContent) {
          try {
            lastMessage.content = await decryptDM(lastMessage.encryptedContent, req.user.username);
            delete lastMessage.encryptedContent;
          } catch {
            lastMessage.content = '[Unable to decrypt]';
          }
        }
        return conv;
      })
    );
    
    res.json(decryptedConversations);
  } catch (error) {
    next(error);
  }
});

dmRoutes.get('/messages/:conversationId', authenticate, async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await getMessages(conversationId, req.user.username);
    
    const decryptedMessages = await Promise.all(
      messages.map(async (msg) => {
        if (msg.encryptedContent) {
          try {
            msg.content = await decryptDM(msg.encryptedContent, req.user.username);
            delete msg.encryptedContent;
          } catch {
            msg.content = '[Unable to decrypt]';
          }
        }
        return msg;
      })
    );
    
    res.json(decryptedMessages);
  } catch (error) {
    next(error);
  }
});
