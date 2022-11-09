import { Injectable } from '@nestjs/common';

import { SendEmailInput } from './email.types';

@Injectable()
export class EmailService {
  // TODO: implement
  public async send(input: SendEmailInput) {
    const { to, text } = input;

    console.log(`You sent an e-mail to "${to}". Message: "${text}".`);
  }
}
