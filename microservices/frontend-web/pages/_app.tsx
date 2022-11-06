import "../styles/globals.css";
import "../styles/main.scss";

import type { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";

import client from "../src/apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}
