import { schema } from '@lib/schema';
import {
  Context,
  IncomingNextMessage,
  SessionUserPayload,
} from '@lib/schema/types';
import { withSession } from '@lib/utils/session';
import { ApolloServer } from 'apollo-server-micro';
import { ServerResponse } from 'http';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

type HandlerContext = { req: IncomingNextMessage; res: ServerResponse };

export const server = new ApolloServer({
  schema,
  dataSources: () => ({}),
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      faviconUrl: '/favicon.ico',
      title: 'API Playground',
      settings: { 'request.credentials': 'include' },
    }),
  ],
  context: ({ req, res }: HandlerContext): Omit<Context, 'dataSources'> => {
    const user = req.session.get<SessionUserPayload>('user');
    return { req, res, user };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default withSession(async (...handler) => {
  await startServer;
  return server.createHandler({ path: '/api/graphql' })(...handler);
});
