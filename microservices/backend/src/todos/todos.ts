import { Blameable } from '@app/collections/behaviours/blameable.behaviour';
import { Softdeletable } from '@app/collections/behaviours/softdeletable.behaviour';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import {
  Collection,
  Combine,
  Entity,
} from '@app/collections/collections.class';
import {
  Field,
  ObjectType,
  Prop,
  Relations,
  Schema,
} from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { TranslatableField } from '@app/collections/translatable-fields/translatable-fields.class';
import { Translatable } from '@app/collections/translatable-fields/translatable-fields.decorators';
import { createEntity } from '@app/collections/utils';

import { EndUser } from '@root/end-users/end-users';

export class DBTodo {
  @Translatable()
  @Field(() => TranslatableField)
  @Prop()
  title: TranslatableField;

  @Field(() => Boolean)
  @Prop()
  isCompleted: boolean;
}

@Relations<Todo>()
  .add({
    field: 'endUser',
    to: () => EndUser,
    fieldId: 'endUserId',
  })
  .build()
@ObjectType()
@Schema()
export class Todo extends Combine(
  Entity,
  DBTodo,
  Timestampable,
  Softdeletable,
  Blameable,
) {
  endUser: EndUser;
  endUserId: ObjectId;
}

export const TodoEntity = createEntity({
  database: DBTodo,
  relational: Todo,
});

export type TodosCollection = Collection<DBTodo, Todo>;
