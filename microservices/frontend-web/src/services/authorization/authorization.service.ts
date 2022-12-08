import { Injectable } from '@libs/di/decorators';

@Injectable()
export class AuthorizationService {
  async sayHi() {
    alert('hi!');
  }
}
