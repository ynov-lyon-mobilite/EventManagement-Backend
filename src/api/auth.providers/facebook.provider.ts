import { prisma } from '@api/prisma-client';
import { UserService } from '@api/schema/services/user.service';
import { Strategy } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { IAuthProvider } from './IAuthProvider';

export class FacebookProvider implements IAuthProvider {
  scope(): string | string[] | undefined {
    return ['email'];
  }
  strategyName(): string {
    return 'facebook';
  }
  isAvailable(): boolean {
    return !!process.env.FACEBOOK_APP_ID && !!process.env.FACEBOOK_APP_SECRET;
  }
  strategy(): Strategy | null {
    if (!this.isAvailable()) return null;
    return new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID!,
        callbackURL: `http://localhost:3000/api/auth/${this.strategyName()}/callback`,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        profileFields: ['id', 'displayName', 'photos', 'emails'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const user = await prisma.user.findUnique({
          where: {
            provider_providerId: {
              provider: 'FACEBOOK',
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
          provider: 'FACEBOOK',
        });

        done(null, userService);
      }
    );
  }
}
