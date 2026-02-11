import { Injectable } from '@nestjs/common';
import { Errors } from '../../../common/errors/errors';
import { SegmentsRepository } from '../dataaccess/segments.repository';
import { UserSegmentMembershipsRepository } from '../dataaccess/user-segment-memberships.repository';
import { CreateSegmentDto } from '../dtos/create-segment.dto';
import { AddSegmentMembershipDto } from '../dtos/add-segment-membership.dto';

@Injectable()
export class SegmentsService {
  constructor(
    private readonly segmentsRepository: SegmentsRepository,
    private readonly membershipsRepository: UserSegmentMembershipsRepository,
  ) {}

  async list(tenantId: string) {
    return this.segmentsRepository.listByTenant(tenantId);
  }

  async create(tenantId: string, dto: CreateSegmentDto) {
    return this.segmentsRepository.create(tenantId, {
      type: dto.type,
      key: dto.key,
      display_name: dto.display_name,
    });
  }

  async addMembership(tenantId: string, segmentId: string, dto: AddSegmentMembershipDto) {
    const segment = await this.segmentsRepository.findById(tenantId, segmentId);
    if (!segment) {
      throw Errors.notFound('Segment not found');
    }

    return this.membershipsRepository.create({
      tenant_id: tenantId,
      user_id: dto.user_id,
      segment_id: segmentId,
      start_date: dto.start_date,
      end_date: dto.end_date ?? null,
    });
  }
}
