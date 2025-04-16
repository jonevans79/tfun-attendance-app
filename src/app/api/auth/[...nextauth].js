import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: 'tfun',
      name: 'The Follow Up Ninja',
      type: 'oauth',
      clientId: '67f6b0157af2dd51f92d5db6-m9a7yd6y',
      clientSecret: '3ec189f0-39e3-4d25-abea-00cbf5d905b9',
      wellKnown: 'https://api.thefollowup.ninja/oauth',
      authorization: { params: { scope: 'locations.readonly contacts.readonly contacts.write' } },
      token: 'https://api.thefollowup.ninja/v1/oauth/token',
      userinfo: 'https://api.thefollowup.ninja/v1/users/me',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});