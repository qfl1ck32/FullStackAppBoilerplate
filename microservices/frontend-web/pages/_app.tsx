import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { use } from '@libs/di/hooks/use';
import { ApolloClient } from 'libs/apollo/apollo.client';
import type { AppProps } from 'next/app';
import { ToasterContainer } from '@root/containers/toaster/Toaster.container';

import 'react-toastify/dist/ReactToastify.css';
import { I18NService } from '@libs/i18n/i18n.service';
import { Language } from '@root/gql/operations';

export default function App(props: AppProps) {
  const apolloClient = use(ApolloClient);
  const i18nService = use(I18NService)

  const { Component, pageProps, router } = props

  i18nService.onLanguageChange(router.locale as Language)

  return (
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />

        <ToasterContainer />
      </ApolloProvider>
    </ChakraProvider>
  );
}
