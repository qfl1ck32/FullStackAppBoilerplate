export class Event<T = any> {
  public readonly payload: T;

  constructor(payload?: T) {
    this.payload = payload;
  }
}
