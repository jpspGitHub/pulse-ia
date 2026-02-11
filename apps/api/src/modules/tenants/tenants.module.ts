import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller';
import { TenantsService } from './services/tenants.service';
import { TenantsRepository } from './dataaccess/tenants.repository';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, TenantsRepository, RolesGuard],
})
export class TenantsModule {}
