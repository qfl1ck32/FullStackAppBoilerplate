import { gql } from '@apollo/client';
import { ApolloClient } from '@libs/apollo/apollo.client';
import { use } from '@libs/di/hooks/use';
import { useEffect } from 'react';

export const Test = () => {
  const client = use(ApolloClient);

  useEffect(() => {
    client
      .query({
        query: gql`
          {
            getUser {
              _id
            }
          }
        `,
      })
      .then((a) => console.log(a.data))
      .catch((e) => console.log({ e }));
  }, []);

  return (
    <div>
      <h5>Hi</h5>
    </div>
  );
};

export default Test;
