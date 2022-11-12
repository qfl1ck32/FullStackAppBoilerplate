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

export type IssueAccessTokenInput = {
  refreshToken: Scalars['String'];
};

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
  login: LoginUserResponse;
  register: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterArgs = {
  input: RegisterUserInput;
};

export type Query = {
  __typename?: 'Query';
  hi: User;
  issueAccessToken: Scalars['String'];
};


export type QueryIssueAccessTokenArgs = {
  input: IssueAccessTokenInput;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export enum Role {
  Admin = 'ADMIN',
  EndUser = 'END_USER'
}

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  createdByUser: User;
  createdByUserId: Scalars['ID'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedByUser?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
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