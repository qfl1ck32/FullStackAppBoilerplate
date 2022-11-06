import { Exception } from '@root/exceptions/exception';

export class UserNotAuthorizedException extends Exception {
  getCode() {
    return 'USER_NOT_AUTHORIZED';
  }

  getMessage() {
    return 'User not authorized.';
  }
}
