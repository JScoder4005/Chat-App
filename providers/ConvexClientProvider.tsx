'use client';

import LoadingLogo from '@/components/shared/LoadingLogo';
import {
  ClerkProvider,
  SignIn,
  SignInButton,
  useAuth,
} from '@clerk/clerk-react';
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const PUBLISH_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(CONVEX_URL);
const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider publishableKey={PUBLISH_KEY}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
