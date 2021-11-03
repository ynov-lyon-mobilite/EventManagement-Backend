'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTakeArgument = exports.createConnectionObject = exports.createConnection = exports.PageInfoObject = exports.CursorObject = void 0;
var builder_1 = require('../builder');
exports.CursorObject = builder_1.builder.objectRef('Cursor');
exports.PageInfoObject = builder_1.builder.objectRef('PageInfo');
builder_1.builder.objectType(exports.CursorObject, {
  fields: function (t) {
    return {
      current: t.expose('current', { type: 'CursorID', nullable: true }),
      take: t.exposeInt('take'),
      total: t.exposeInt('total'),
    };
  },
});
builder_1.builder.objectType(exports.PageInfoObject, {
  fields: function (t) {
    return {
      totalPages: t.exposeInt('totalPages'),
      currentPage: t.exposeInt('currentPage'),
      hasNextPage: t.exposeBoolean('hasNextPage'),
      hasPreviousPage: t.exposeBoolean('hasPreviousPage'),
    };
  },
});
var createConnection = function (object) {
  var objectConnection = object.name.concat('Connection');
  var connectionRef = builder_1.builder.objectRef(objectConnection);
  var objectNode = object.name.concat('Node');
  var nodeRef = builder_1.builder.objectRef(objectNode);
  var edgeType = builder_1.builder.objectType(nodeRef, {
    name: objectNode,
    fields: function (t) {
      return {
        cursor: t.field({
          type: 'CursorID',
          resolve: function (_a) {
            var uuid = _a.uuid;
            return uuid;
          },
        }),
        node: t.field({
          type: object,
          resolve: function (all) {
            return all;
          }, // Why the fuck
        }),
      };
    },
  });
  connectionRef.implement({
    fields: function (t) {
      return {
        pageInfo: t.field({
          type: exports.PageInfoObject,
          resolve: function (root) {
            return root.pageInfo;
          },
        }),
        edges: t.field({
          type: [edgeType],
          resolve: function (root) {
            return root.edges;
          },
        }),
        cursor: t.field({
          type: exports.CursorObject,
          resolve: function (root) {
            return root.cursor;
          },
        }),
      };
    },
  });
  return connectionRef;
};
exports.createConnection = createConnection;
var createConnectionObject = function (_a) {
  var ctOpt = _a.count,
    edOpt = _a.edges,
    args = _a.args;
  return __awaiter(void 0, void 0, void 0, function () {
    var countPromise, edgesPromise, _b, count, edges, cursor;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          countPromise = Promise.resolve(
            typeof ctOpt === 'function' ? ctOpt() : ctOpt
          );
          edgesPromise = Promise.resolve(
            typeof edOpt === 'function' ? edOpt() : edOpt
          );
          return [4 /*yield*/, Promise.all([countPromise, edgesPromise])];
        case 1:
          (_b = _c.sent()), (count = _b[0]), (edges = _b[1]);
          cursor = args.cursor ? args.cursor : null;
          return [
            2 /*return*/,
            {
              cursor: {
                current: cursor,
                take: Math.abs((0, exports.getTakeArgument)(args)),
                total: count,
              },
              edges: edges,
              pageInfo: computePageInfos(args, count),
            },
          ];
      }
    });
  });
};
exports.createConnectionObject = createConnectionObject;
var computePageInfos = function (args, count) {
  var _a;
  var take = (0, exports.getTakeArgument)(args);
  var totalPages = Math.abs(Math.ceil(count / take));
  var response = {
    currentPage:
      (_a = args.targetPage) !== null && _a !== void 0 ? _a : args.currentPage,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: totalPages,
  };
  if (response.currentPage <= 0) response.currentPage = 1;
  if (response.currentPage > totalPages) response.currentPage = totalPages;
  response.hasNextPage = response.currentPage !== totalPages;
  response.hasPreviousPage = response.currentPage !== 1;
  return response;
};
var getTakeArgument = function (args) {
  var value = args.take || 10;
  if (args.targetPage && args.currentPage > args.targetPage) {
    return -Math.abs(value);
  }
  return value;
};
exports.getTakeArgument = getTakeArgument;
