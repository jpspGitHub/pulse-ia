import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { MessageSender } from '../../../domain/enums/message-sender.enum';

export type MessageRecord = {
  id: string;
  tenant_id: string;
  session_id: string;
  sender: MessageSender;
  text: string;
  created_at: Date;
};

@Injectable()
export class MessagesRepository {
  async create(input: {
    tenant_id: string;
    session_id: string;
    sender: MessageSender;
    text: string;
  }): Promise<MessageRecord> {
    return DbClient.callProcedureRequired<MessageRecord>('api_create_message', [
      input.tenant_id,
      input.session_id,
      input.sender,
      input.text,
    ]);
  }

  async listBySession(tenantId: string, sessionId: string): Promise<MessageRecord[]> {
    return DbClient.callProcedure<MessageRecord>('api_list_messages_by_session', [
      tenantId,
      sessionId,
    ]);
  }
}
