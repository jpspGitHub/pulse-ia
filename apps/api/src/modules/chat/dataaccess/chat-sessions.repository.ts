import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { ChatChannel } from '../../../domain/enums/chat-channel.enum';
import { ChatFlowType } from '../../../domain/enums/chat-flow-type.enum';
import { ChatStatus } from '../../../domain/enums/chat-status.enum';
import { LocaleCode } from '../../../domain/enums/locale.enum';

export type ChatSessionRecord = {
  id: string;
  tenant_id: string;
  user_id: string;
  channel: ChatChannel;
  flow_type: ChatFlowType;
  locale: LocaleCode;
  status: ChatStatus;
  started_at: Date;
  ended_at: Date | null;
};

@Injectable()
export class ChatSessionsRepository {
  async create(input: {
    tenant_id: string;
    user_id: string;
    channel: ChatChannel;
    flow_type: ChatFlowType;
    locale: LocaleCode;
  }): Promise<ChatSessionRecord> {
    return DbClient.callProcedureRequired<ChatSessionRecord>('api_create_chat_session', [
      input.tenant_id,
      input.user_id,
      input.channel,
      input.flow_type,
      input.locale,
    ]);
  }

  async findById(tenantId: string, id: string): Promise<ChatSessionRecord | null> {
    return DbClient.callProcedureSingle<ChatSessionRecord>('api_get_chat_session', [tenantId, id]);
  }
}
