export class Event<T> {
  public readonly payload: T;

  constructor(payload: T) {
    this.payload = payload;
  }
}
