import { schema } from '@api/schema';
import {
  Context,
  datasourcesServices,
  IncomingNextMessage,
  JWTPayload,
} from '@api/schema/types';
import { ServerResponse, createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { JWT_SECRET } from '@api/utils/jwt';
import { verify } from 'jsonwebtoken';
import { registerProviders } from '@api/auth.providers';
import { useSession } from '@api/utils/session';
import cookieParser from 'cookie-parser';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

const PORT = process.env.PORT ?? 3000;

async function startApolloServer() {
  const app = express();
  app.enable('trust proxy');
  app.use(cookieParser());

  app.use(useSession);

  registerProviders(app);
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    introspection: true,
    dataSources: () => datasourcesServices as any,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        faviconUrl: '/favicon.ico',
        title: 'API Playground',
        settings: { 'request.credentials': 'include' },
      }),
    ],
    context: ({ req, res }: HandlerContext): Omit<Context, 'dataSources'> => {
      const usr = req.user ?? req.session?.user;

      const jwt = req.headers['authorization'];

      let user: Context['user'] = usr;
      if (!usr) {
        if (typeof jwt === 'string') {
          try {
            const decoded = verify(jwt.slice(7), JWT_SECRET) as JWTPayload;
            user = decoded;
          } catch (error) {}
        }
      }

      return { req, res, user };
    },
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/api/graphql',
    cors: {
      credentials: true,
      origin: true,
    },
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer();
