import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';
import { Exception } from '@app/exceptions/exception.class';
import { UsersModule } from '@app/users';

import { GQLContext } from './defs';

import { GraphQLError } from 'graphql';
import * as path from 'path';

@Module({
  imports: [
    UsersModule,

    GQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),

      driver: ApolloDriver,
      debug: true,
      playground: true,

      // TODO: types + transformer of some kind?
      context: (ctx: GQLContext) => {
        const { jwt } = ctx.req;

        let userId: ObjectId | null;

        if (jwt?.payload) {
          userId = new ObjectId(jwt.payload.userId);
        }

        return {
          ...ctx,

          userId,
        } as GQLContext;
      },

      formatError(error: GraphQLError) {
        if (!(error.originalError instanceof Exception)) return error;

        const originalError = error.originalError as Exception;

        return {
          ...error,
          code: originalError.getCode(),
          metadata: originalError.getMetadata(),
        };
      },
    }),
  ],

  providers: [],
})
export class GraphQLModule {}
