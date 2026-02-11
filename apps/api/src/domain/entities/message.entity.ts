import { MessageSender } from '../enums/message-sender.enum';

export interface Message {
  id: string;
  tenant_id: string;
  session_id: string;
  sender: MessageSender;
  text: string;
  created_at: Date;
}
