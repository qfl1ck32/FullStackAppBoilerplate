import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@app/collections/collections.decorators';
import { EventManagerService } from '@app/event-manager';

import { CreateUserInput } from './dto/create.input';

import { UserCreatedEvent } from './events/user-created.event';

import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';

import { User, UsersCollection } from './users';
import { UsersSecurityService } from './users-security.service';

@Injectable()
export class UsersService {
  public emailVerificationTokenLength: number;

  constructor(
    @InjectCollection(User)
    public readonly collection: UsersCollection,
    public readonly security: UsersSecurityService,
    private eventManager: EventManagerService,
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

    await this.eventManager.emit(
      new UserCreatedEvent({
        userId,
      }),
    );

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
