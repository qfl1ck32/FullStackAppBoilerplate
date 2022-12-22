export interface MergeDeepArgs {
  target: Record<string, any>;

  assignFunction?: Function;

  sources: Record<string, any>[];
}
