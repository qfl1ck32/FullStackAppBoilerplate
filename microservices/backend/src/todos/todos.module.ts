import { Module } from '@nestjs/common';

import { ProvideCollection } from '@app/collections/collections.provider';

import { TodoEntity } from './todos';
import { TodosService } from './todos.service';

// TODO: how to handle the need of providing the collectino twice?
@Module({
  providers: [TodosService, ProvideCollection(TodoEntity)],
  exports: [TodosService, ProvideCollection(TodoEntity)],
})
export class TodosModule {}
