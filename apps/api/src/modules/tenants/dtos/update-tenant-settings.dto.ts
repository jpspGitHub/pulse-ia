import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class CheckinScheduleDto {
  @IsOptional()
  @IsString()
  cadence?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  days?: string[];

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UpdateTenantSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  anonymity_threshold?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CheckinScheduleDto)
  checkin_schedule?: CheckinScheduleDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabled_dimensions?: string[];
}
