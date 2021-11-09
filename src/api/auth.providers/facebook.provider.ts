import passport, { Strategy } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { IAuthProvider } from './AuthProvider';

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      (_accessToken, _refreshToken, profile, done) => {
        console.log(profile);
        done(null, profile);
      }
    )
  );
}

export class FacebookProvider implements IAuthProvider {
  strategy(): Strategy {
    throw new Error('Method not implemented.');
  }
  authUrl(): void {
    throw new Error('Method not implemented.');
  }
  callback(app: Express.Application): void {
    throw new Error('Method not implemented.');
  }
  static getStrategy() {
    return passport.authenticate('facebook', { scope: ['email'] });
  }
}
