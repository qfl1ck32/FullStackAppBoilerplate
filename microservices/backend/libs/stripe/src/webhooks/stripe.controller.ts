import { Controller, Post, Req } from '@nestjs/common';

import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  @Post('/wehooks')
  async onWebhook(@Req() request: Request) {
    console.log(request);
  }
}
