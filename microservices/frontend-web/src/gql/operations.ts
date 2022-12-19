import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type EndUsersTodosCreateInput = {
  title: Scalars['String'];
};

export type IssueAccessTokenInput = {
  refreshToken: Scalars['String'];
};

export enum Language {
  En = 'en',
  Ro = 'ro'
}

export type LoginUserInput = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type LoginUserResponse = {
  __typename?: 'LoginUserResponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  endUsersCreateTodo: Todo;
  login: LoginUserResponse;
  register: Scalars['Boolean'];
};


export type MutationEndUsersCreateTodoArgs = {
  input: EndUsersTodosCreateInput;
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterArgs = {
  input: RegisterUserInput;
};

export type Query = {
  __typename?: 'Query';
  framework: Scalars['String'];
  getUser: User;
  getYupSchema: Scalars['String'];
  issueAccessToken: Scalars['String'];
};


export type QueryIssueAccessTokenArgs = {
  input: IssueAccessTokenInput;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export enum Role {
  Admin = 'admin',
  EndUser = 'end_user'
}

export type Todo = {
  __typename?: 'Todo';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  createdByUser: User;
  createdByUserId: Scalars['ID'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedByUser?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']>;
  isCompleted: Scalars['Boolean'];
  isDeleted?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  createdByUser?: Maybe<User>;
  createdByUserId?: Maybe<Scalars['ID']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedByUser?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  preferredLanguage: Language;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type IssueAccessTokenQueryVariables = Exact<{
  input: IssueAccessTokenInput;
}>;


export type IssueAccessTokenQuery = { __typename?: 'Query', issueAccessToken: string };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: boolean };

export type LoginUserMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginUserResponse', accessToken: string, refreshToken: string } };

export type CreateTodoMutationVariables = Exact<{
  input: EndUsersTodosCreateInput;
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', endUsersCreateTodo: { __typename?: 'Todo', _id: string, title: string, isCompleted: boolean } };

export type GetYupSchemaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetYupSchemaQuery = { __typename?: 'Query', getYupSchema: string };


export const IssueAccessTokenDocument = gql`
    query IssueAccessToken($input: IssueAccessTokenInput!) {
  issueAccessToken(input: $input)
}
    `;

/**
 * __useIssueAccessTokenQuery__
 *
 * To run a query within a React component, call `useIssueAccessTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useIssueAccessTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIssueAccessTokenQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useIssueAccessTokenQuery(baseOptions: Apollo.QueryHookOptions<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>(IssueAccessTokenDocument, options);
      }
export function useIssueAccessTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>(IssueAccessTokenDocument, options);
        }
export type IssueAccessTokenQueryHookResult = ReturnType<typeof useIssueAccessTokenQuery>;
export type IssueAccessTokenLazyQueryHookResult = ReturnType<typeof useIssueAccessTokenLazyQuery>;
export type IssueAccessTokenQueryResult = Apollo.QueryResult<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
  register(input: $input)
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($input: LoginUserInput!) {
  login(input: $input) {
    accessToken
    refreshToken
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const CreateTodoDocument = gql`
    mutation CreateTodo($input: EndUsersTodosCreateInput!) {
  endUsersCreateTodo(input: $input) {
    _id
    title
    isCompleted
  }
}
    `;
export type CreateTodoMutationFn = Apollo.MutationFunction<CreateTodoMutation, CreateTodoMutationVariables>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTodoMutation(baseOptions?: Apollo.MutationHookOptions<CreateTodoMutation, CreateTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, options);
      }
export type CreateTodoMutationHookResult = ReturnType<typeof useCreateTodoMutation>;
export type CreateTodoMutationResult = Apollo.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = Apollo.BaseMutationOptions<CreateTodoMutation, CreateTodoMutationVariables>;
export const GetYupSchemaDocument = gql`
    query GetYupSchema {
  getYupSchema
}
    `;

/**
 * __useGetYupSchemaQuery__
 *
 * To run a query within a React component, call `useGetYupSchemaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYupSchemaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYupSchemaQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetYupSchemaQuery(baseOptions?: Apollo.QueryHookOptions<GetYupSchemaQuery, GetYupSchemaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetYupSchemaQuery, GetYupSchemaQueryVariables>(GetYupSchemaDocument, options);
      }
export function useGetYupSchemaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetYupSchemaQuery, GetYupSchemaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetYupSchemaQuery, GetYupSchemaQueryVariables>(GetYupSchemaDocument, options);
        }
export type GetYupSchemaQueryHookResult = ReturnType<typeof useGetYupSchemaQuery>;
export type GetYupSchemaLazyQueryHookResult = ReturnType<typeof useGetYupSchemaLazyQuery>;
export type GetYupSchemaQueryResult = Apollo.QueryResult<GetYupSchemaQuery, GetYupSchemaQueryVariables>;