import { builder } from '../builder';

builder.queryField('isAlive', (t) => t.boolean({ resolve: () => true }));

builder.queryField('ping', (t) => t.string({ resolve: () => 'pong' }));
