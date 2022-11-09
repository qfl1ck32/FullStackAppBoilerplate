import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';

import { ObjectId } from '@root/database/defs';
import { Exception } from '@root/exceptions/exception';
import { UsersModule } from '@root/users/users.module';

import { GQLContext } from './defs';
import { GraphQLError } from 'graphql';
import * as path from 'path';

@Module({
  imports: [
    GQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),

      driver: ApolloDriver,
      debug: false,
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

    UsersModule,
  ],

  providers: [],
})
export class GraphQLModule {}
