import { schema } from '@api/schema';
import { IncomingNextMessage } from '@api/schema/types';
import { ServerResponse, createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { useSession } from '@api/utils/session';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

// export const se prver = new ApolloServer({
//   schema,
//   dataSources: () => ({}),
//   introspection: true,
//   plugins: [
//     ApolloServerPluginLandingPageGraphQLPlayground({
//       faviconUrl: '/favicon.ico',
//       title: 'API Playground',
//       settings: { 'request.credentials': 'include' },
//     }),
//   ],
//   context: ({ req, res }: HandlerContext): Omit<Context, 'dataSources'> => {
//     const user = req.session.get('user') as User;
//     return { req, res, user };
//   },
// });

async function startApolloServer() {
  const app = express();
  app.use(useSession);
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
    ],
    context: ({ req, res }: HandlerContext) => {
      const user = req.session.user;
      return { req, res, user };
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}

startApolloServer();
