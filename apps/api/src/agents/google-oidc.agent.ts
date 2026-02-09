import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOidcAgent {
  getAuthUrl() {
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  }

  async exchangeCode() {
    return {
      accessToken: 'placeholder',
      idToken: 'placeholder',
    };
  }
}
