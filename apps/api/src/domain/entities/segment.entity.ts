import { SegmentType } from '../enums/segment-type.enum';

export interface Segment {
  id: string;
  tenant_id: string;
  type: SegmentType;
  key: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
}
