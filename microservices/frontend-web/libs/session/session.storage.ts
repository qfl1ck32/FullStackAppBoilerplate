import { ISessionStorage } from './defs';

export interface SessionStorage {
  state: ISessionStorage;

  get<T extends keyof ISessionStorage>(key: T): ISessionStorage[T];

  set<T extends keyof ISessionStorage>(key: T, value: ISessionStorage[T]): void;
}

export class UISessionStorage implements SessionStorage {
  private localStorageKey: string;

  public state: ISessionStorage;

  constructor() {
    this.localStorageKey = 'session-storage';

    // TODO: any better way?
    if (typeof window !== 'undefined') {
      this.state = JSON.parse(
        localStorage.getItem(this.localStorageKey) || '{}',
      );
    } else {
      this.state = {} as ISessionStorage;
    }
  }

  public get<T extends keyof ISessionStorage>(key: T) {
    return this.state[key];
  }

  public set<T extends keyof ISessionStorage>(
    key: T,
    value: ISessionStorage[T],
  ) {
    this.state[key] = value;

    localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
  }
}
