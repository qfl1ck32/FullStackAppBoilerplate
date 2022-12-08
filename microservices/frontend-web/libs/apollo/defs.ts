import '@apollo/client';
import { ExecutionPatchResult } from '@apollo/client';
import { ExecutionResult } from 'graphql';

export interface SingleExecutionResult<
  TData = Record<string, any>,
  TContext = Record<string, any>,
  TExtensions = Record<string, any>,
> extends ExecutionResult<TData, TExtensions> {
  data: TData;
  context?: TContext;
}

export type FetchResult<
  TData = Record<string, any>,
  TContext = Record<string, any>,
  TExtensions = Record<string, any>,
> = SingleExecutionResult<TData, TContext, TExtensions>;
//   | ExecutionPatchResult<TData, TExtensions>;
