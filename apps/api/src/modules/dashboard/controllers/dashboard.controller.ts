import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { Roles } from '../../../common/guards/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Errors } from '../../../common/errors/errors';
import { AuthUser } from '../../../common/types/auth-user';
import { Role } from '../../../domain/enums/role.enum';
import { AlertStatus } from '../../../domain/enums/alert-status.enum';
import { DashboardService } from '../services/dashboard.service';

function requireDate(param?: string) {
  if (!param || !/^\d{4}-\d{2}-\d{2}$/.test(param)) {
    throw Errors.validation({ period_start: 'Invalid date format (YYYY-MM-DD)' });
  }
  return param;
}

@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @Get('pulse')
  async getPulse(@Req() request: Request, @Query('period_start') periodStart?: string) {
    const user = (request as Request & { user: AuthUser }).user;
    const start = requireDate(periodStart);
    return this.dashboardService.getPulse(user.tenantId, start);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @Get('segments')
  async getSegments(@Req() request: Request, @Query('period_start') periodStart?: string) {
    const user = (request as Request & { user: AuthUser }).user;
    const start = requireDate(periodStart);
    return this.dashboardService.getSegmentedMetrics(user.tenantId, start);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @Get('alerts')
  async getAlerts(@Req() request: Request, @Query('status') status?: AlertStatus) {
    const user = (request as Request & { user: AuthUser }).user;
    const resolvedStatus = status ?? AlertStatus.Open;
    if (!Object.values(AlertStatus).includes(resolvedStatus)) {
      throw Errors.validation({ status: 'Invalid alert status' });
    }
    return this.dashboardService.getAlerts(user.tenantId, resolvedStatus);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @Get('recommended-actions')
  async getRecommendedActions(
    @Req() request: Request,
    @Query('period_start') periodStart?: string,
  ) {
    const user = (request as Request & { user: AuthUser }).user;
    const start = requireDate(periodStart);
    return this.dashboardService.getRecommendedActions(user.tenantId, start);
  }
}
