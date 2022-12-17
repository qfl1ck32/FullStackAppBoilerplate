import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@app/collections/collections.decorators';

import { Todo, TodosCollection } from '@root/todos/todos';

@Injectable()
export class EndUsersService {
  constructor(
    @InjectCollection(Todo) protected readonly todosCollection: TodosCollection,
  ) {}
}
