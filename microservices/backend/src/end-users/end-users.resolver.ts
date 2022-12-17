import { Mutation, Resolver } from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';
import {
  GetInput,
  GetLanguage,
  GetUserId,
} from '@app/graphql/graphql.decorators';
import { Language } from '@app/i18n/defs';

import { EndUsersTodosCreateInput } from './dto/create-todo.input';

import { EndUsersService } from './end-users.service';

import { Todo } from '@root/todos/todos';
import { TodosService } from '@root/todos/todos.service';

@Resolver()
export class EndUsersResolver {
  constructor(
    private readonly endUsersService: EndUsersService,
    private readonly todosService: TodosService,
  ) {}

  @Mutation(() => Todo)
  async endUsersCreateTodo(
    @GetInput() input: EndUsersTodosCreateInput,
    @GetUserId() userId: ObjectId,
    @GetLanguage() language: Language,
  ) {
    return this.todosService.create(
      {
        ...input,
        language,
      },
      userId,
    );
  }
}
