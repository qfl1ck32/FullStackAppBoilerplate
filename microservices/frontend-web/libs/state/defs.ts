export type Subscriber<State = any> = (
  previousState: State,
  newState: State,
) => void | Promise<void>;
