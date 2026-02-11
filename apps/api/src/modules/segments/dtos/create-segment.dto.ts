import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SegmentType } from '../../../domain/enums/segment-type.enum';

export class CreateSegmentDto {
  @IsEnum(SegmentType)
  type!: SegmentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  key!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  display_name!: string;
}
