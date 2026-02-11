import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { Roles } from '../../../common/guards/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Role } from '../../../domain/enums/role.enum';
import { AuthUser } from '../../../common/types/auth-user';
import { SegmentsService } from '../services/segments.service';
import { CreateSegmentDto } from '../dtos/create-segment.dto';
import { AddSegmentMembershipDto } from '../dtos/add-segment-membership.dto';

@Controller('v1/segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @Get()
  async list(@Req() request: Request) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.segmentsService.list(user.tenantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Req() request: Request, @Body() body: CreateSegmentDto) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.segmentsService.create(user.tenantId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':id/memberships')
  async addMembership(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: AddSegmentMembershipDto,
  ) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.segmentsService.addMembership(user.tenantId, id, body);
  }
}
