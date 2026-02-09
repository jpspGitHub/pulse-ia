import { Injectable } from '@nestjs/common';
import { MicrosoftOidcAgent } from '../agents/microsoft-oidc.agent';

@Injectable()
export class MicrosoftSsoService {
  constructor(private readonly oidcAgent: MicrosoftOidcAgent) {}

  getAuthUrl() {
    return this.oidcAgent.getAuthUrl();
  }
}
