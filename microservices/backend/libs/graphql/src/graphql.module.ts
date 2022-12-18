import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';
import { Exception } from '@app/exceptions/exception';
import { Language } from '@app/i18n/defs';

import { GQLContext } from './defs';
import { FrameworkResolver } from './framework/framework.resolver';

import acceptLanguage from 'accept-language';
import { GraphQLError } from 'graphql';
import * as path from 'path';

@Global()
@Module({
  imports: [
    GQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),

      driver: ApolloDriver,
      debug: true,
      playground: true,

      csrfPrevention: true,

      // TODO: types + transformer of some kind?
      context: (ctx: GQLContext) => {
        acceptLanguage.languages(Object.values(Language));

        const { jwt } = ctx.req;

        let userId: ObjectId | null;

        // TODO: should be some kind of default for the app?
        let language: Language = Language.en;

        if (jwt?.payload) {
          userId = new ObjectId(jwt.payload.userId);

          // TODO: how to query the user and get the preferredLanguage? Does it even make sense?
        } else {
          const acceptedLanguage = ctx.req?.headers?.['accept-language'];

          language = acceptLanguage.get(acceptedLanguage) as Language;
        }

        return {
          ...ctx,
          language,

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

  providers: [FrameworkResolver],
})
export class GraphQLModule {}
