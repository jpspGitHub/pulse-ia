import { IsEnum, IsOptional } from 'class-validator';
import { ChatChannel } from '../../../domain/enums/chat-channel.enum';
import { ChatFlowType } from '../../../domain/enums/chat-flow-type.enum';
import { LocaleCode } from '../../../domain/enums/locale.enum';

export class CreateSessionDto {
  @IsOptional()
  @IsEnum(ChatChannel)
  channel?: ChatChannel;

  @IsOptional()
  @IsEnum(ChatFlowType)
  flow_type?: ChatFlowType;

  @IsOptional()
  @IsEnum(LocaleCode)
  locale?: LocaleCode;
}
