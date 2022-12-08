import { Injectable } from '@libs/di/decorators';

import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from './constants';

@Injectable()
export class AuthTokenService {
  get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY) as string;
  }

  get refreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY) as string;
  }

  set accessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
  }

  set refreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken);
  }

  public onRefreshTokenExpired() {
    window.location.href = '/login?err=REFRESH_TOKEN_EXPIRED';
  }
}
