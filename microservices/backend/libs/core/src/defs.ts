export type Constructor<Return = any, Args = any> = new (
  ...args: Args[]
) => Return;

export type Decorator = (
  target: Object,
  key: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
