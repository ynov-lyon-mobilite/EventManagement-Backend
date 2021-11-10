import { Strategy } from 'passport';
import { IAuthProvider } from './IAuthProvider';
import { OAuth2Strategy } from 'passport-google-oauth';
import { prisma } from '@api/prisma-client';
import { UserService } from '@api/schema/services/user.service';

export class GoogleProvider implements IAuthProvider {
  scope(): string | string[] | undefined {
    return ['https://www.googleapis.com/auth/plus.login', 'email'];
  }
  strategyName(): string {
    return 'google';
  }
  isAvailable(): boolean {
    return !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  }
  strategy(): Strategy | null {
    if (!this.isAvailable()) return null;
    return new OAuth2Strategy(
      {
        callbackURL: `http://localhost:3000/api/auth/${this.strategyName()}/callback`,
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const user = await prisma.user.findUnique({
          where: {
            provider_providerId: {
              provider: 'GOOGLE',
              providerId: profile.id,
            },
          },
          rejectOnNotFound: false,
        });

        if (user) {
          return done(null, user);
        }

        const userService = await new UserService().createUser({
          providerId: profile.id,
          displayName: profile.displayName,
          email: profile.emails![0].value,
          provider: 'GOOGLE',
        });

        done(null, userService);
      }
    );
  }
}
