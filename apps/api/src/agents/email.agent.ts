import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAgent {
  async sendWelcomeEmail(email: string) {
    return {
      accepted: [email],
      messageId: 'placeholder-message-id',
    };
  }
}
