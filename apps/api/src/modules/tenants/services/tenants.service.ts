import { Injectable } from '@nestjs/common';
import { Errors } from '../../../common/errors/errors';
import { TenantSettings } from '../../../domain/entities/tenant.entity';
import { TenantsRepository } from '../dataaccess/tenants.repository';
import { UpdateTenantSettingsDto } from '../dtos/update-tenant-settings.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly tenantsRepository: TenantsRepository) {}

  async getTenant(tenantId: string) {
    const tenant = await this.tenantsRepository.findById(tenantId);
    if (!tenant) {
      throw Errors.notFound('Tenant not found');
    }
    return tenant;
  }

  async updateSettings(tenantId: string, dto: UpdateTenantSettingsDto) {
    const tenant = await this.tenantsRepository.findById(tenantId);
    if (!tenant) {
      throw Errors.notFound('Tenant not found');
    }

    const merged: TenantSettings = {
      ...(tenant.settings ?? {}),
    } as TenantSettings;

    if (dto.anonymity_threshold !== undefined) {
      merged.anonymity_threshold = dto.anonymity_threshold;
    }
    if (dto.checkin_schedule !== undefined) {
      merged.checkin_schedule = {
        ...(tenant.settings?.checkin_schedule ?? {}),
        ...dto.checkin_schedule,
      };
    }
    if (dto.enabled_dimensions !== undefined) {
      merged.enabled_dimensions = dto.enabled_dimensions as TenantSettings['enabled_dimensions'];
    }

    const updated = await this.tenantsRepository.updateSettings(tenantId, merged);
    if (!updated) {
      throw Errors.internal('Failed to update tenant settings');
    }
    return updated;
  }
}
