import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@app/collections/collections.decorators';

import { CreateUserInput } from './dto/create.input';

import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';

import { UsersSecurityService } from './users-security.service';
import { User, UsersCollection } from './users.entity';

@Injectable()
export class UsersService {
  public emailVerificationTokenLength: number;

  constructor(
    @InjectCollection(User)
    public readonly collection: UsersCollection,
    public readonly security: UsersSecurityService,
  ) {
    this.emailVerificationTokenLength = 16;
  }

  async create(input: CreateUserInput) {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      requiresEmailValidation,
    } = input;

    const user = await this.collection.findOne({
      $or: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      throw new UserAlreadyExistsException();
    }

    const hash = this.security.hashPassword(password);

    const { insertedId: userId } = await this.collection.insertOne({
      firstName,
      lastName,
      email,
      username,
      password: {
        hash,
        isEnabled: !requiresEmailValidation,
        requiresEmailValidation,
      },
    });

    return userId;
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    return this.collection.findOne({
      $or: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    });
  }
}
