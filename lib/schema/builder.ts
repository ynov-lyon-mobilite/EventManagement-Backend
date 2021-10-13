import SchemaBuilder from '@giraphql/core';
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects';
import ScopeAuthPlugin from '@giraphql/plugin-scope-auth';
import MockPlugin from '@giraphql/plugin-mocks';
import { Context, ShemaBuilderOptions } from '@types';

export const builder = new SchemaBuilder<ShemaBuilderOptions>({
  plugins: [SimpleObjectsPlugin, ScopeAuthPlugin, MockPlugin],
  authScopes: async ({ user }: Context) => {
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

builder.scalarType('Date', {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => new Date(date),
});
