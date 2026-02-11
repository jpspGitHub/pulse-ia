export interface UserSegmentMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  segment_id: string;
  start_date: string;
  end_date: string | null;
}
