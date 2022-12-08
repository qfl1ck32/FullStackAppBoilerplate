import { Injectable } from '@libs/di/decorators';
import { useEffect, useState } from 'react';

import { ISessionStorage } from './defs';
import { UISessionStorage } from './session.storage';

@Injectable()
export class SessionService {
  storage: UISessionStorage;

  constructor() {
    this.storage = new UISessionStorage();
  }

  public get<T extends keyof ISessionStorage>(
    key: T,
    defaultValue?: ISessionStorage[T],
  ) {
    const value = this.storage.state[key];

    const [state, setState] = useState(value || defaultValue);

    useEffect(() => {
      setState(value);
    }, [value]);

    return state;
  }

  public set<T extends keyof ISessionStorage>(
    key: T,
    value: ISessionStorage[T],
  ) {
    this.storage.set(key, value);
  }
}
