import { Injectable } from '@nestjs/common';
import { Errors } from '../../../common/errors/errors';
import { AuthUser } from '../../../common/types/auth-user';
import { Role } from '../../../domain/enums/role.enum';
import { ChatChannel } from '../../../domain/enums/chat-channel.enum';
import { ChatFlowType } from '../../../domain/enums/chat-flow-type.enum';
import { LocaleCode } from '../../../domain/enums/locale.enum';
import { MessageSender } from '../../../domain/enums/message-sender.enum';
import { UsersRepository } from '../../auth/dataaccess/users.repository';
import { ChatSessionsRepository } from '../dataaccess/chat-sessions.repository';
import { MessagesRepository } from '../dataaccess/messages.repository';
import { AddMessageDto } from '../dtos/add-message.dto';
import { CreateSessionDto } from '../dtos/create-session.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatSessionsRepository: ChatSessionsRepository,
    private readonly messagesRepository: MessagesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createSession(user: AuthUser, dto: CreateSessionDto) {
    const userRecord = await this.usersRepository.findById(user.sub);
    if (!userRecord) {
      throw Errors.notFound('User not found');
    }

    const locale = dto.locale ?? user.locale ?? userRecord.preferred_locale ?? LocaleCode.Es;
    const channel = dto.channel ?? ChatChannel.Webchat;
    const flowType = dto.flow_type ?? ChatFlowType.Checkin;

    return this.chatSessionsRepository.create({
      tenant_id: user.tenantId,
      user_id: user.sub,
      channel,
      flow_type: flowType,
      locale,
    });
  }

  async addMessage(user: AuthUser, sessionId: string, dto: AddMessageDto) {
    const session = await this.chatSessionsRepository.findById(user.tenantId, sessionId);
    if (!session) {
      throw Errors.notFound('Session not found');
    }

    if (user.role === Role.Employee && session.user_id !== user.sub) {
      throw Errors.forbidden('Not allowed to access this session');
    }

    const sender =
      user.role === Role.Employee ? MessageSender.User : (dto.sender ?? MessageSender.User);

    return this.messagesRepository.create({
      tenant_id: user.tenantId,
      session_id: sessionId,
      sender,
      text: dto.text,
    });
  }

  async getSession(user: AuthUser, sessionId: string) {
    const session = await this.chatSessionsRepository.findById(user.tenantId, sessionId);
    if (!session) {
      throw Errors.notFound('Session not found');
    }

    if (user.role === Role.Employee && session.user_id !== user.sub) {
      throw Errors.forbidden('Not allowed to access this session');
    }

    const messages = await this.messagesRepository.listBySession(user.tenantId, sessionId);
    return { session, messages };
  }
}
