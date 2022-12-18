import { ObjectId } from '@app/collections/defs';
import { Event } from '@app/event-manager/event';

export class UserCreatedEvent extends Event<{
  userId: ObjectId;
}> {}
