import * as path from 'path';

import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Exception } from '@root/exceptions/exception';
import { UsersModule } from '@root/users/users.module';

@Module({
  imports: [
    GQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),

      driver: ApolloDriver,
      debug: false,
      playground: true,

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
