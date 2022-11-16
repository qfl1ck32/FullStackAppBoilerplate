import { AddRawBodyMiddleware } from './add-raw-body.middleware';

describe('AddRawBodyMiddleware', () => {
  it('should be defined', () => {
    expect(new AddRawBodyMiddleware()).toBeDefined();
  });
});
