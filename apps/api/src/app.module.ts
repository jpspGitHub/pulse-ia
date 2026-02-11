import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { GoogleSsoModule } from './modules/google-sso.module';
import { HealthModule } from './modules/health.module';
import { MagicLinkModule } from './modules/magic-link.module';
import { MicrosoftSsoModule } from './modules/microsoft-sso.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { SegmentsModule } from './modules/segments/segments.module';
import { ChatModule } from './modules/chat/chat.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    GoogleSsoModule,
    MicrosoftSsoModule,
    MagicLinkModule,
    TenantsModule,
    SegmentsModule,
    ChatModule,
    DashboardModule,
  ],
})
export class AppModule {}
