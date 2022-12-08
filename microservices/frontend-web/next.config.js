const path = require('path');

// TODO: fix
// const { Language } = require('./src/gql/operations');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
  },

  i18n: {
    locales: ['ro', 'en'],
    defaultLocale: 'en',
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],

    prependData: `@import "main.scss";`,
  },
};

module.exports = nextConfig;
