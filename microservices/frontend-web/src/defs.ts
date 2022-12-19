import 'graphql/error';

declare module 'graphql/error' {
  export class GraphQLError {
    code: string;
    metadata?: Record<string, any>;
  }
}
