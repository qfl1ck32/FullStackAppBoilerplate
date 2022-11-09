import client from '../src/apollo/client';
import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}
