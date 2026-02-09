import { Module } from '@nestjs/common';
import { GoogleSsoController } from '../controllers/google-sso.controller';
import { GoogleSsoService } from '../services/google-sso.service';
import { GoogleOidcAgent } from '../agents/google-oidc.agent';

@Module({
  controllers: [GoogleSsoController],
  providers: [GoogleSsoService, GoogleOidcAgent],
})
export class GoogleSsoModule {}
