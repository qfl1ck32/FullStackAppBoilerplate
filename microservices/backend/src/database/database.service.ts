import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() public connection: Connection) {}

  /**
   * @WARNING
   * This will clean the whole database.
   */
  public async clean() {
    const collections = await this.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
