import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersSecurityService } from '@root/users-security/users-security.service';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create.input';
import { User, UserDocument } from './entities/user.entity';

import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    public readonly security: UsersSecurityService,
  ) {}

  async create(input: CreateUserInput) {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      requiresEmailValidation,
    } = input;

    const user = await this.userModel.findOne({
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

    const newUser = await new this.userModel({
      firstName,
      lastName,

      email,
      username,

      password: {
        hash,

        isEnabled: !requiresEmailValidation,

        hasEmailVerified: requiresEmailValidation ? false : undefined,
      },
    }).save();

    return newUser;
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    return this.userModel.findOne({
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
