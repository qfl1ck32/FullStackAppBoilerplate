import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { OnEvent } from '@app/event-manager/decorators/on-event.decorator';
import { UserCreatedEvent } from '@app/users/events/user-created.event';

import { EndUser, EndUsersCollection } from './end-users';

import { Todo, TodosCollection } from '@root/todos/todos';

@Injectable()
export class EndUsersService {
  constructor(
    @InjectCollection(EndUser)
    public readonly endUsersCollection: EndUsersCollection,
    @InjectCollection(Todo) protected readonly todosCollection: TodosCollection,
  ) {}

  async createEndUser(userId: ObjectId) {
    await this.endUsersCollection.insertOne(
      {},
      {
        context: {
          userId,
        },
      },
    );
  }

  @OnEvent(UserCreatedEvent)
  async onUserCreated(event: UserCreatedEvent) {
    const { userId } = event.payload;

    await this.createEndUser(userId);
  }
}
