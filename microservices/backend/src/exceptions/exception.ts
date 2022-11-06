export class Exception<TData extends Record<string, any> = null> extends Error {
  private metadata: TData;

  private getName() {
    const name = this.constructor.name.match(/[A-Z][a-z]+/g);

    // To remove "Exception"
    name.pop();

    return name;
  }

  getCode() {
    return this.getName()
      .map((name) => name.toUpperCase())
      .join('_');
  }

  getMessage() {
    const [first, ...rest] = this.getName();

    return `${first} ${rest.map((part) => part.toLowerCase()).join(' ')}`;
  }

  getMetadata() {
    return this.metadata || null;
  }

  constructor(...args: TData extends null ? [] : [TData]) {
    super();

    const message = this.getMessage();

    this.metadata = args[0] as TData;

    super.message = message;
  }
}
