import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class AddSegmentMembershipDto {
  @IsUUID()
  user_id!: string;

  @IsDateString()
  start_date!: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
