const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],

    prependData: `@import "main.scss";`,
  },
};

module.exports = nextConfig;
