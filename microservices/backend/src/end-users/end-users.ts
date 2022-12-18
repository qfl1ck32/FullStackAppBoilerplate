import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Collection, Combine, Entity } from '@app/collections/collections';
import {
  ObjectType,
  Relations,
  Schema,
} from '@app/collections/collections.decorators';
import { createEntity } from '@app/collections/utils';

import { Todo } from '@root/todos/todos';

export class DBEndUser {}

@Relations<EndUser>()
  .add({
    field: 'todos',
    to: () => Todo,
    inversedBy: 'endUser',
  })
  .build()
@ObjectType()
@Schema()
export class EndUser extends Combine(
  Entity,
  DBEndUser,
  Timestampable,
  Blameable,
  Softdeletable,
) {
  todos: Todo[];
}

export const EndUsersEntity = createEntity({
  database: DBEndUser,
  relational: EndUser,
});

export type EndUsersCollection = Collection<DBEndUser, EndUser>;
