'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.schema = void 0;
var path_1 = require('path');
var fs_1 = require('fs');
var graphql_1 = require('graphql');
var builder_1 = require('./builder');
require('./resolvers/index');
exports.schema = builder_1.builder.toSchema({});
if (process.env.NODE_ENV === 'development') {
  var schemaAsString = (0, graphql_1.printSchema)(
    (0, graphql_1.lexicographicSortSchema)(exports.schema)
  );
  console.info('🖊 Write schema');
  var folderPath = (0, path_1.join)(process.cwd());
  (0, fs_1.mkdirSync)(folderPath, { recursive: true });
  (0, fs_1.writeFileSync)(
    (0, path_1.join)(folderPath, 'schema.gql'),
    schemaAsString
  );
}
