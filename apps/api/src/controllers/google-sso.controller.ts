import { Controller, Get } from '@nestjs/common';
import { GoogleSsoService } from '../services/google-sso.service';

@Controller('auth/google')
export class GoogleSsoController {
  constructor(private readonly googleSsoService: GoogleSsoService) {}

  @Get('login')
  login() {
    return {
      message: 'Google OIDC login placeholder',
      authUrl: this.googleSsoService.getAuthUrl(),
    };
  }
}
