import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSecurityService {
  private saltRounds: number;

  constructor() {
    this.saltRounds = 10;
  }

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  public isPasswordCorrect(hash: string, password: string) {
    return bcrypt.compareSync(password, hash);
  }
}
