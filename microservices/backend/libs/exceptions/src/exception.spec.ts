import { Exception } from './exception.class';

describe('Exception', () => {
  it('should be defined', () => {
    expect(new Exception()).toBeDefined();
  });

  it('should have the right default message / code', async () => {
    class TooColoredPonyException extends Exception {}

    const exception = new TooColoredPonyException();

    expect(exception.getMessage()).toBe('Too colored pony');

    expect(exception.getCode()).toBe('TOO_COLORED_PONY');

    expect(exception.getMetadata()).toBe(null);
  });
});
