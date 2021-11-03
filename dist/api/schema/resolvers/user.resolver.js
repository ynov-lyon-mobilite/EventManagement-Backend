'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.UserConnection = exports.UserObject = void 0;
var builder_1 = require('src/api/schema/builder');
var prisma_client_1 = require('src/api/prisma-client');
var pagination_args_1 = require('../args/pagination.args');
var client_1 = require('@prisma/client');
var generic_args_1 = require('../args/generic.args');
var isOwnerOrAdmin_1 = require('../validation/isOwnerOrAdmin');
var user_args_1 = require('../args/user.args');
var bcryptjs_1 = require('bcryptjs');
var event_resolver_1 = require('./event.resolver');
var edge_resolver_1 = require('./edge.resolver');
exports.UserObject = builder_1.builder.objectRef('User');
exports.UserConnection = (0, edge_resolver_1.createConnection)(
  exports.UserObject
);
builder_1.builder.objectType(exports.UserObject, {
  fields: function (t) {
    return {
      uuid: t.exposeString('uuid', {}),
      displayName: t.exposeString('displayName'),
      email: t.exposeString('email', { nullable: true }),
      username: t.exposeString('username', { nullable: true }),
      roles: t.expose('roles', { type: [client_1.RoleEnum] }),
      joinedEvents: t.field({
        type: [event_resolver_1.EventObject],
        authScopes: function (_a, _, _b) {
          var uuid = _a.uuid;
          var user = _b.user;
          console.log(
            uuid,
            user === null || user === void 0 ? void 0 : user.uuid
          );
          return (0, isOwnerOrAdmin_1.isOwnerOrAdmin)(uuid, user);
        },
        resolve: function (_a) {
          var uuid = _a.uuid;
          return __awaiter(void 0, void 0, void 0, function () {
            var bookings;
            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  return [
                    4 /*yield*/,
                    prisma_client_1.prisma.user
                      .findUnique({ where: { uuid: uuid } })
                      .bookings({ select: { event: true } }),
                  ];
                case 1:
                  bookings = _b.sent();
                  return [
                    2 /*return*/,
                    bookings.map(function (booking) {
                      return booking.event;
                    }),
                  ];
              }
            });
          });
        },
      }),
    };
  },
});
builder_1.builder.queryField('users', function (t) {
  return t.field({
    type: exports.UserConnection,
    args: __assign({}, (0, pagination_args_1.cursorArgs)(t)),
    authScopes: { isAdmin: true },
    resolve: function (_root, args) {
      var findArgs = (0, pagination_args_1.generateCursorFindMany)(args);
      return (0, edge_resolver_1.createConnectionObject)({
        args: args,
        count: prisma_client_1.prisma.user.count(),
        edges: prisma_client_1.prisma.user.findMany(
          __assign(__assign({}, findArgs), { orderBy: { createdAt: 'asc' } })
        ),
      });
    },
  });
});
builder_1.builder.queryField('user', function (t) {
  return t.field({
    type: exports.UserObject,
    nullable: true,
    args: {
      id: t.arg.string(),
    },
    resolve: function (_root, args) {
      return prisma_client_1.prisma.user.findUnique({
        where: { uuid: args.id },
      });
    },
  });
});
builder_1.builder.mutationField('deleteUser', function (t) {
  return t.field({
    type: exports.UserObject,
    args: {
      uuid: (0, generic_args_1.uuidArg)(t),
    },
    authScopes: function (_, _a, _b) {
      var uuid = _a.uuid;
      var user = _b.user;
      return (0, isOwnerOrAdmin_1.isOwnerOrAdmin)(uuid, user);
    },
    resolve: function (_, _a) {
      var uuid = _a.uuid;
      return prisma_client_1.prisma.user.delete({ where: { uuid: uuid } });
    },
  });
});
builder_1.builder.mutationField('updateUser', function (t) {
  return t.field({
    type: exports.UserObject,
    args: {
      displayName: t.arg.string({}),
      email: (0, user_args_1.emailArg)(t, false),
      password: (0, user_args_1.passwordArg)(t, false),
      username: (0, user_args_1.usernameArg)(t, false),
      uuid: (0, generic_args_1.uuidArg)(t),
      roles: t.arg({ type: [client_1.RoleEnum], required: false }),
    },
    authScopes: function (_, _a, _b) {
      var uuid = _a.uuid,
        roles = _a.roles;
      var user = _b.user;
      if (
        roles &&
        !(user === null || user === void 0
          ? void 0
          : user.roles.includes('ADMIN'))
      )
        return false;
      return (0, isOwnerOrAdmin_1.isOwnerOrAdmin)(uuid, user);
    },
    resolve: function (_, args) {
      return __awaiter(void 0, void 0, void 0, function () {
        var hashPassword, _a, datas;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!args.password) return [3 /*break*/, 2];
              return [4 /*yield*/, (0, bcryptjs_1.hash)(args.password, 4)];
            case 1:
              _a = _b.sent();
              return [3 /*break*/, 3];
            case 2:
              _a = undefined;
              _b.label = 3;
            case 3:
              hashPassword = _a;
              datas = {
                displayName: args.displayName,
                email: args.email,
                password: hashPassword,
                username: args.username,
              };
              if (args.roles) datas.roles = args.roles;
              return [
                2 /*return*/,
                prisma_client_1.prisma.user.update({
                  where: { uuid: args.uuid },
                  data: __assign({}, datas),
                }),
              ];
          }
        });
      });
    },
  });
});
