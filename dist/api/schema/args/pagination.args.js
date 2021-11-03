'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateCursorFindMany = exports.cursorArgs = exports.paginationArgs = void 0;
var edge_resolver_1 = require('../resolvers/edge.resolver');
var paginationArgs = function (t) {
  return {
    limit: t.arg.int({ required: false }),
  };
};
exports.paginationArgs = paginationArgs;
var cursorArgs = function (t) {
  return {
    take: t.arg.int({
      required: false,
      defaultValue: 10,
      description: 'Max 50, Min 1',
      validate: {
        min: [1, { message: '1 min per request' }],
        max: [50, { message: '50 max per request' }],
      },
    }),
    cursor: t.arg({ type: 'CursorID', required: false }),
    currentPage: t.arg.int({ required: false, defaultValue: 1 }),
    targetPage: t.arg.int({ required: false }),
  };
};
exports.cursorArgs = cursorArgs;
var generateCursorFindMany = function (args) {
  var findArgs = {
    skip: 0,
  };
  var getCursorArgs = function (crs) {
    var _a;
    if (!crs) {
      return {
        skip:
          args.take *
          (((_a = args.targetPage) !== null && _a !== void 0
            ? _a
            : args.currentPage) -
            1),
      };
    }
    return {
      cursor: {
        uuid: crs,
      },
      skip: 1,
    };
  };
  var cursorOpts = getCursorArgs(args.cursor);
  if (cursorOpts) {
    findArgs.cursor = cursorOpts.cursor;
    findArgs.skip = cursorOpts.skip;
  }
  findArgs.take = (0, edge_resolver_1.getTakeArgument)(args);
  return findArgs;
};
exports.generateCursorFindMany = generateCursorFindMany;
