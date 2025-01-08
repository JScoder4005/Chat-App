//this we will get from the docs.convex.dev/auth/clerk and replace the domain with the JWT template provided from clerk

const config = {
  providers: [
    {
      domain: 'https://sweet-cod-8.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
};

export default config;
