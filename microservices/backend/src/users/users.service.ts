import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@root/database/database.decorators';
import { ObjectId } from '@root/database/defs';
import { UsersSecurityService } from '@root/users-security/users-security.service';

import { CreateUserInput } from './dto/create.input';

import { User, UsersCollection } from './entities/user.entity';

import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';

@Injectable()
export class UsersService {
  public emailVerificationTokenLength: number;

  constructor(
    @InjectCollection(User) private readonly collection: UsersCollection,
    private readonly security: UsersSecurityService,
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

    const { insertedId } = await this.collection.insertOne(
      {
        firstName: 'a',
      } as any,
      {
        context: {
          userId: new ObjectId('aaaaaaaaaaaa'),
        },
      },
    );

    return insertedId;

    throw new Error('Bee');

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

    // const newUser = await this.collection.insertOne({
    //   firstName,
    //   lastName,

    //   email,
    //   username,

    //   password: {
    //     hash,

    //     isEnabled: !requiresEmailValidation,

    //     requiresEmailValidation,
    //   },
    // });

    // return newUser;
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
