import { WriterArgs } from '@app/core/models/defs';

type ExceptionSimpleArgs = {
  hideOnUI?: boolean;
};

export type ExceptionArgs<TData> = TData extends null
  ? ExceptionSimpleArgs
  : {
      metadata: TData;
    } & ExceptionSimpleArgs;

export interface ExtractArgs extends WriterArgs {
  exceptionsPath: string;
}
