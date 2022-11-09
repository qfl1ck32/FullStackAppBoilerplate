// TODO: this is broken for some reason. Generates "UserRegisterDocument" twice
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql',
  documents: 'src/operations.graphql',
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },

  generates: {
    'src/gql/': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        withMutationFn: true,
      },
    },
  },
};

export default config;
