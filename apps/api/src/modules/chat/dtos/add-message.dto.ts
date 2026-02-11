import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageSender } from '../../../domain/enums/message-sender.enum';

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsEnum(MessageSender)
  sender?: MessageSender;
}
