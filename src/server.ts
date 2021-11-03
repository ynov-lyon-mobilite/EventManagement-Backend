import { schema } from '@api/schema';
import { Context, IncomingNextMessage } from '@api/schema/types';
import { ServerResponse, createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { useSession } from '@api/utils/session';
import { graphqlUploadExpress } from 'graphql-upload';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

export const pubSub = new PubSub();

async function startApolloServer() {
  const app = express();
  app.use(useSession);
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
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
              console.info('Closing subscription server');
              return subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({ req, res }: HandlerContext): Omit<Context, 'dataSources'> => {
      const user = req.session.user;
      return { req, res, user, pubSub };
    },
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();
  server.applyMiddleware({ app, path: '/api/graphql' });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}

startApolloServer();
