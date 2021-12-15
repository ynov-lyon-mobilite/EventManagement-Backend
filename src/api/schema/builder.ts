import SchemaBuilder from '@giraphql/core';
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects';
import ScopeAuthPlugin from '@giraphql/plugin-scope-auth';
import ValidationPlugin from '@giraphql/plugin-validation';
import { CommonContext, ShemaBuilderOptions } from 'src/api/schema/types';

export const builder = new SchemaBuilder<ShemaBuilderOptions>({
  plugins: [SimpleObjectsPlugin, ScopeAuthPlugin, ValidationPlugin],
  authScopes: async ({ user }: CommonContext) => {
    const auth: ShemaBuilderOptions['AuthScopes'] = {
      isLogged: false,
      isAdmin: false,
    };

    if (!user) return auth;

    auth.isLogged = true;
    if (user.roles.includes('ADMIN')) auth.isAdmin = true;

    return auth;
  },
  defaultInputFieldRequiredness: true,
});

// This initializes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});

builder.scalarType('Date', {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => new Date(date),
});

builder.scalarType('CursorID', {
  serialize: (cursor) => Buffer.from(cursor).toString('base64'),
  parseValue: (cursor) => Buffer.from(cursor, 'base64').toString('utf8'),
});
