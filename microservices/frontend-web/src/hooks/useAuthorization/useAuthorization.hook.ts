import { useState } from 'react';

import {
  LoginUserInput,
  LoginUserResponse,
  useLoginUserMutation,
} from '@root/gql/operations';

export const useAuthorization = () => {
  // const [loginMutation] = useLoginUserMutation();
  // const [isLoggingIn, setIsLoggingIn] = useState(false);
  // const [loginError, setLoginError] = useState(null);
  // const login = async (input: LoginUserInput) => {
  //   setIsLoggingIn(true);
  //   try {
  //     const { data } = await loginMutation({
  //       variables: {
  //         input,
  //       },
  //     });
  //     const response = data?.login as LoginUserResponse;
  //     const { accessToken, refreshToken } = response;
  //     setAccessToken(accessToken);
  //     setRefreshToken(refreshToken);
  //   } catch (err: any) {
  //     setLoginError(err);
  //   }
  //   setIsLoggingIn(false);
  // };
  // return {
  //   login,
  //   isLoggingIn,
  //   loginError,
  // };
};
