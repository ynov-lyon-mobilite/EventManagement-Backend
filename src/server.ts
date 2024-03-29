import { schema } from '@api/schema';
import {
  CommonContext,
  datasourcesServices,
  HttpContext,
  IncomingNextMessage,
  SubscriptionContext,
} from '@api/schema/types';
import { resolverUserToken } from '@api/utils/jwt';
import { CustomPubSub } from '@api/utils/pubsub.utils';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer, ServerResponse } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

const PORT = process.env.PORT ?? 3000;

const pubsub = new CustomPubSub();

async function startApolloServer() {
  const app = express();
  app.enable('trust proxy');
  app.use(cookieParser());

  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams: any): SubscriptionContext => {
        const { authorization } = connectionParams;
        const user = resolverUserToken(authorization);
        return {
          pubsub,
          dataSources: datasourcesServices,
          user,
        };
      },
    },
    { server: httpServer, path: '/api/graphql' }
  );

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
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({
      req,
      res,
    }: HandlerContext): Omit<HttpContext, 'dataSources'> => {
      const jwt = req.headers['authorization'];
      let user: CommonContext['user'] = resolverUserToken(jwt);
      return { req, res, user, pubsub };
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
  console.info(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer();
