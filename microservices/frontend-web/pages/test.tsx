import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useHelloLazyQuery } from '@root/gql/operations';

import { useAuthorization } from '@hooks/useAuthorization/useAuthorization.hook';

export const Test = () => {
  const [t, st] = useState(0);

  const [query] = useHelloLazyQuery();

  const { login, isLoggingIn, loginError } = useAuthorization();

  const f = async () => {
    try {
      const result = await query();

      console.log(result.data?.getHello);

      console.log(result.error);
    } catch (err) {
      console.log({ err });
    }
  };

  const loginTest = async () => {
    await login({
      usernameOrEmail: 'rusuandreicristian32@gmail.com',
      password: 'abababab',
    });
  };

  useEffect(() => {
    if (t === 0) return;

    f();
  }, [t]);

  return (
    <div>
      <h5>Hi</h5>
      <Button onClick={() => st((p) => p + 1)}>Try</Button>
      <Button onClick={loginTest}>Login here</Button>
    </div>
  );
};

export default Test;
