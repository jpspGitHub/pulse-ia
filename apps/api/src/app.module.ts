import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { GoogleSsoModule } from './modules/google-sso.module';
import { HealthModule } from './modules/health.module';
import { MagicLinkModule } from './modules/magic-link.module';
import { MicrosoftSsoModule } from './modules/microsoft-sso.module';

@Module({
  imports: [AuthModule, HealthModule, GoogleSsoModule, MicrosoftSsoModule, MagicLinkModule],
})
export class AppModule {}
