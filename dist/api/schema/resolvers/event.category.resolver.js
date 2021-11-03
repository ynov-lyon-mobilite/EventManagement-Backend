'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.EventCategoryObject = void 0;
var prisma_client_1 = require('src/api/prisma-client');
var builder_1 = require('../builder');
exports.EventCategoryObject = builder_1.builder.objectRef('EventCategory');
builder_1.builder.objectType(exports.EventCategoryObject, {
  fields: function (t) {
    return {
      uuid: t.exposeString('uuid'),
      name: t.exposeString('name'),
    };
  },
});
builder_1.builder.queryField('eventCategories', function (t) {
  return t.field({
    type: [exports.EventCategoryObject],
    resolve: function () {
      return prisma_client_1.prisma.eventCategories.findMany();
    },
  });
});
