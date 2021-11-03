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
import cors from 'cors';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

async function startApolloServer() {
  const app = express();
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );
  app.use(useSession);
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    introspection: true,
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
      return { req, res, user };
    },
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();
  server.applyMiddleware({ app, path: '/api/graphql', cors: false });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT ?? 8080 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}

startApolloServer();
