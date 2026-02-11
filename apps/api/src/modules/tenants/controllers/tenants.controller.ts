import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { Roles } from '../../../common/guards/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Role } from '../../../domain/enums/role.enum';
import { AuthUser } from '../../../common/types/auth-user';
import { TenantsService } from '../services/tenants.service';
import { UpdateTenantSettingsDto } from '../dtos/update-tenant-settings.dto';

@Controller('v1/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.tenantsService.getTenant(user.tenantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('me/settings')
  async updateSettings(@Req() request: Request, @Body() body: UpdateTenantSettingsDto) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.tenantsService.updateSettings(user.tenantId, body);
  }
}
