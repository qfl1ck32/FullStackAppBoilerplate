import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

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

  // TODO: not like this :mad:
  public generateToken(length: number) {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}
