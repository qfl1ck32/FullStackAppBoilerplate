import { Constructor } from '@libs/core/defs';
import { Injectable } from '@libs/di/decorators';
import { use } from '@libs/di/hooks/use';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Subscriber } from './defs';

@Injectable()
export class StateService<State extends {} = any, Config extends {} = any> {
  private _previousState: State;
  private _state: State;
  private _config: Config;

  private _subscribers: Subscriber[];

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

  private __subscribe(subscriber: Subscriber) {
    this._subscribers.push(subscriber);
  }

  private __unsubscribe(subscriber: Subscriber) {
    this._subscribers.splice(this._subscribers.findIndex(subscriber), 1);
  }
}
