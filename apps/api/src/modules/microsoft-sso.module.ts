import { Module } from '@nestjs/common';
import { MicrosoftSsoController } from '../controllers/microsoft-sso.controller';
import { MicrosoftSsoService } from '../services/microsoft-sso.service';
import { MicrosoftOidcAgent } from '../agents/microsoft-oidc.agent';

@Module({
  controllers: [MicrosoftSsoController],
  providers: [MicrosoftSsoService, MicrosoftOidcAgent],
})
export class MicrosoftSsoModule {}
