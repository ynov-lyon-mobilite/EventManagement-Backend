import { prisma } from '@api/prisma-client';
import { Express } from 'express';
import passport from 'passport';
import { FacebookProvider } from './facebook.provider';
import { IAuthProvider } from './IAuthProvider';

const providers: IAuthProvider[] = [new FacebookProvider()];

export const registerProviders = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/success', (_, res) => {
    res.send(`<script>window.close()</script>`);
  });

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (usr: any, done) => {
    const user = await prisma.user.findUnique({
      where: { uuid: usr.uuid },
    });
    done(null, user);
  });

  providers.forEach((provider) => {
    const strategy = provider.strategy();
    if (provider.isAvailable() && strategy) {
      console.info(`Registering ${strategy.name} strategy`);
      passport.use(strategy);
      provider.callback(app);
    }
  });
};
