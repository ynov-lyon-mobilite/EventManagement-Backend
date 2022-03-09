import { db } from '@api/clients/prisma-client';
import { Express } from 'express';
import passport from 'passport';
import { FacebookProvider } from './facebook.provider';
import { GoogleProvider } from './google.provider';
import { IAuthProvider } from './IAuthProvider';

const providers: IAuthProvider[] = [
  new FacebookProvider(),
  new GoogleProvider(),
];

export const registerProviders = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/success', (_, res) => {
    res.send(`<script>window.close()</script>`);
  });

  app.get('/api/auth/failure', (_, res) => {
    res.status(401).json({ message: 'Authentication failed' });
  });

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (usr: any, done) => {
    const user = await db.user.findUnique({
      where: { uuid: usr.uuid },
    });
    done(null, user);
  });

  providers.forEach((provider) => {
    const strategy = provider.strategy();
    if (provider.isAvailable() && strategy) {
      console.info(`Registering ${strategy.name} strategy`);
      passport.use(strategy);
      generateStrategyCallback(app, provider.strategyName(), provider.scope());
    }
  });
};

const generateStrategyCallback = (
  app: Express,
  strategyName: string,
  scope: ReturnType<IAuthProvider['scope']>
) => {
  app.get(
    `/api/auth/${strategyName}`,
    passport.authenticate(strategyName, { scope })
  );
  app.get(
    `/api/auth/${strategyName}/callback`,
    passport.authenticate(strategyName, {
      successRedirect: '/api/auth/success',
      failureRedirect: '/api/auth/failure',
    })
  );
};
