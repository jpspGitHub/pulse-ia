import { Controller, Get } from '@nestjs/common';
import { MicrosoftSsoService } from '../services/microsoft-sso.service';

@Controller('auth/microsoft')
export class MicrosoftSsoController {
  constructor(private readonly microsoftSsoService: MicrosoftSsoService) {}

  @Get('login')
  login() {
    return {
      message: 'Microsoft OIDC login placeholder',
      authUrl: this.microsoftSsoService.getAuthUrl(),
    };
  }
}
