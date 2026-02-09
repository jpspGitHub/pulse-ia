import { Injectable } from '@nestjs/common';
import { GoogleOidcAgent } from '../agents/google-oidc.agent';

@Injectable()
export class GoogleSsoService {
  constructor(private readonly oidcAgent: GoogleOidcAgent) {}

  getAuthUrl() {
    return this.oidcAgent.getAuthUrl();
  }
}
