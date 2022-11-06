const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'app-access-jwt';

const REFRESH_TOKEN_LOCAL_STORAGE_KEY = 'app-refresh-jwt';

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken);
};

export const onRefreshTokenExpired = async () => {
  window.location.href = '/login?err=REFRESH_TOKEN_EXPIRED';
};
