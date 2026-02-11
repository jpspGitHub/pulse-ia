import { ChatChannel } from '../enums/chat-channel.enum';
import { ChatFlowType } from '../enums/chat-flow-type.enum';
import { ChatStatus } from '../enums/chat-status.enum';
import { LocaleCode } from '../enums/locale.enum';

export interface ChatSession {
  id: string;
  tenant_id: string;
  user_id: string;
  channel: ChatChannel;
  flow_type: ChatFlowType;
  locale: LocaleCode;
  status: ChatStatus;
  started_at: Date;
  ended_at: Date | null;
}
