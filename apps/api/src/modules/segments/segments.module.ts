import { Module } from '@nestjs/common';
import { SegmentsController } from './controllers/segments.controller';
import { SegmentsService } from './services/segments.service';
import { SegmentsRepository } from './dataaccess/segments.repository';
import { UserSegmentMembershipsRepository } from './dataaccess/user-segment-memberships.repository';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [SegmentsController],
  providers: [SegmentsService, SegmentsRepository, UserSegmentMembershipsRepository, RolesGuard],
})
export class SegmentsModule {}
