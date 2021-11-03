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
var prisma_client_1 = require('src/api/prisma-client');
var builder_1 = require('src/api/schema/builder');
var bcryptjs_1 = require('bcryptjs');
var sucess_resolver_1 = require('./sucess.resolver');
var user_resolver_1 = require('./user.resolver');
var user_args_1 = require('../args/user.args');
var session_1 = require('@api/utils/session');
builder_1.builder.mutationField('login', function (t) {
  return t.field({
    type: user_resolver_1.UserObject,
    args: {
      username: (0, user_args_1.usernameArg)(t),
      password: (0, user_args_1.passwordArg)(t),
    },
    resolve: function (_, _a, ctx) {
      var username = _a.username,
        password = _a.password;
      return __awaiter(void 0, void 0, void 0, function () {
        var user, isPassValid;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              return [
                4 /*yield*/,
                prisma_client_1.prisma.user.findUnique({
                  where: { username: username },
                }),
              ];
            case 1:
              user = _b.sent();
              if (!user) throw new Error('Invalid credentials');
              if (!user.password) return [3 /*break*/, 3];
              return [
                4 /*yield*/,
                (0, bcryptjs_1.compare)(password, user.password),
              ];
            case 2:
              isPassValid = _b.sent();
              if (!isPassValid) throw new Error('Invalid credentials');
              _b.label = 3;
            case 3:
              ctx.req.session.user = user;
              ctx.user = user;
              return [2 /*return*/, user];
          }
        });
      });
    },
  });
});
builder_1.builder.mutationField('register', function (t) {
  return t.field({
    type: user_resolver_1.UserObject,
    args: {
      username: (0, user_args_1.usernameArg)(t),
      password: (0, user_args_1.passwordArg)(t),
      email: (0, user_args_1.emailArg)(t),
    },
    resolve: function (_root, _a, ctx) {
      var password = _a.password,
        email = _a.email,
        username = _a.username;
      return __awaiter(void 0, void 0, void 0, function () {
        var hashPassword, user;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              return [4 /*yield*/, (0, bcryptjs_1.hash)(password, 4)];
            case 1:
              hashPassword = _b.sent();
              return [
                4 /*yield*/,
                prisma_client_1.prisma.user.create({
                  data: {
                    displayName: username,
                    username: username,
                    password: hashPassword,
                    email: email,
                    roles: {
                      set: 'DEV',
                    },
                  },
                }),
              ];
            case 2:
              user = _b.sent();
              ctx.req.session.user = user;
              return [2 /*return*/, user];
          }
        });
      });
    },
  });
});
builder_1.builder.queryField('user_infos', function (t) {
  return t.field({
    description: 'Get connected user informations',
    type: user_resolver_1.UserObject,
    authScopes: {
      isLogged: true,
    },
    resolve: function (_root, _args, _a) {
      var user = _a.user;
      return prisma_client_1.prisma.user.findUnique({
        where: { uuid: user.uuid },
      });
    },
  });
});
builder_1.builder.mutationField('logout', function (t) {
  return t.field({
    type: sucess_resolver_1.SuccessObject,
    authScopes: { isLogged: true },
    resolve: function (_root, _arg, ctx) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, (0, session_1.destroySession)(ctx.req)];
            case 1:
              _a.sent();
              return [2 /*return*/, { success: true }];
          }
        });
      });
    },
  });
});
