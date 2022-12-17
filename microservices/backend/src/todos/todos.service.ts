import { Injectable } from '@nestjs/common';

import { InjectCollection } from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';

import { TodosCreateInput } from './dto/create.input';

import { Todo, TodosCollection } from './todos';

@Injectable()
export class TodosService {
  constructor(
    @InjectCollection(Todo) public readonly todosCollection: TodosCollection,
  ) {}

  public async create(input: TodosCreateInput, userId: ObjectId) {
    const { title, language } = input;

    console.log({ title, language });

    return;

    await this.todosCollection.insertOne(
      {
        title,
        isCompleted: false,
      },
      {
        context: {
          userId,
          language,
        },
      },
    );
  }
}
