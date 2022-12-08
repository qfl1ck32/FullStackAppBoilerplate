import { Constructor } from '@libs/core/defs';
import { Injectable } from '@libs/di/decorators';
import { use } from '@libs/di/hooks/use';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Subscriber } from './defs';

@Injectable()
export class StateService<State extends {} = any, Config extends {} = any> {
  protected _previousState: State;
  protected _state: State;
  protected _config: Config;

  protected _subscribers: Subscriber[];

  constructor() {
    this._previousState = Object();
    this._state = Object();
    this._config = Object();

    this._subscribers = [];
  }

  get state() {
    return this._state;
  }

  public updateState(state: Partial<State>) {
    this.setState({
      ...this.state,
      ...state,
    });
  }

  public setState(state: State) {
    this._previousState = this._state;
    this._state = state;

    for (const subscriber of this._subscribers) {
      subscriber(this._previousState, this._state);
    }
  }

  public __subscribe(subscriber: Subscriber) {
    this._subscribers.push(subscriber);
  }

  public __unsubscribe(subscriber: Subscriber) {
    this._subscribers.splice(this._subscribers.findIndex(subscriber), 1);
  }
}

export function useStateService<T extends StateService>(
  Service: Constructor<T>,
) {
  const service = use(Service);

  const [_, setState] = useState();

  useEffect(() => {
    service.__subscribe(setState);

    return () => {
      service.__unsubscribe(setState);
    };
  }, []);

  return service;
}
