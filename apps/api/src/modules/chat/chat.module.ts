import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatSessionsRepository } from './dataaccess/chat-sessions.repository';
import { MessagesRepository } from './dataaccess/messages.repository';
import { UsersRepository } from '../auth/dataaccess/users.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatSessionsRepository, MessagesRepository, UsersRepository],
})
export class ChatModule {}
