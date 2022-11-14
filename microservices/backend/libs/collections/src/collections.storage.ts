import { Injectable } from '@nestjs/common';

import { Constructor } from '@app/core/defs';

import { Collection } from './collections.class';

@Injectable()
export class CollectionsStorage {
  collections: Collection[];

  constructor() {
    this.collections = [];
  }

  public add(collection: Collection) {
    const exists = this.collections.find(
      (savedCollection) => savedCollection === collection,
    );

    if (exists) return;

    this.collections.push(collection);
  }

  public get<T>(entity: Constructor<T>) {
    return this.collections.find(
      (collection) => collection.entity === entity,
    ) as Collection<T>;
  }
}