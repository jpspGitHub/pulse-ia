import { Injectable } from '@nestjs/common';

@Injectable()
export class MicrosoftOidcAgent {
  getAuthUrl() {
    return 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  }

  async exchangeCode() {
    return {
      accessToken: 'placeholder',
      idToken: 'placeholder',
    };
  }
}
