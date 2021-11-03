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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.EventConnection = exports.EventObject = void 0;
var prisma_client_1 = require('src/api/prisma-client');
var generic_args_1 = require('../args/generic.args');
var pagination_args_1 = require('../args/pagination.args');
var builder_1 = require('../builder');
var edge_resolver_1 = require('./edge.resolver');
var event_category_resolver_1 = require('./event.category.resolver');
var user_resolver_1 = require('./user.resolver');
exports.EventObject = builder_1.builder.objectRef('Event');
exports.EventConnection = (0, edge_resolver_1.createConnection)(
  exports.EventObject
);
builder_1.builder.objectType(exports.EventObject, {
  fields: function (t) {
    return {
      title: t.exposeString('title'),
      startDate: t.expose('startDate', { type: 'Date' }),
      endDate: t.expose('startDate', { type: 'Date' }),
      description: t.exposeString('description', { nullable: true }),
      price: t.float({
        resolve: function (_a) {
          var price = _a.price;
          return price !== null && price !== void 0 ? price : 0;
        },
      }),
      category: t.field({
        type: event_category_resolver_1.EventCategoryObject,
        resolve: function (_a) {
          var uuid = _a.uuid;
          return __awaiter(void 0, void 0, void 0, function () {
            var category;
            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  return [
                    4 /*yield*/,
                    prisma_client_1.prisma.event
                      .findUnique({ where: { uuid: uuid } })
                      .category(),
                  ];
                case 1:
                  category = _b.sent();
                  return [2 /*return*/, category];
              }
            });
          });
        },
      }),
      participants: t.field({
        type: user_resolver_1.UserConnection,
        args: __assign({}, (0, pagination_args_1.cursorArgs)(t)),
        resolve: function (_a, args) {
          var uuid = _a.uuid;
          return __awaiter(void 0, void 0, void 0, function () {
            var _b, cursor, skip, take, cursorArg, bookings;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0:
                  (_b = (0, pagination_args_1.generateCursorFindMany)(args)),
                    (cursor = _b.cursor),
                    (skip = _b.skip),
                    (take = _b.take);
                  cursorArg = (
                    cursor === null || cursor === void 0 ? void 0 : cursor.uuid
                  )
                    ? {
                        eventUuid_userUuid: {
                          userUuid: cursor.uuid,
                          eventUuid: uuid,
                        },
                      }
                    : undefined;
                  return [
                    4 /*yield*/,
                    prisma_client_1.prisma.event
                      .findUnique({ where: { uuid: uuid } })
                      .bookings({
                        select: { user: true },
                        take: take,
                        skip: skip,
                        cursor: cursorArg,
                      }),
                  ];
                case 1:
                  bookings = _c.sent();
                  return [
                    2 /*return*/,
                    (0, edge_resolver_1.createConnectionObject)({
                      args: args,
                      edges: bookings.map(function (booking) {
                        return booking.user;
                      }),
                      count: prisma_client_1.prisma.booking.count({
                        where: { event: { uuid: uuid } },
                      }),
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
builder_1.builder.queryField('events', function (t) {
  return t.field({
    type: exports.EventConnection,
    args: __assign({}, (0, pagination_args_1.cursorArgs)(t)),
    resolve: function (_, args) {
      var findArgs = (0, pagination_args_1.generateCursorFindMany)(args);
      var where = { startDate: { gt: new Date() } };
      return (0, edge_resolver_1.createConnectionObject)({
        args: args,
        count: prisma_client_1.prisma.event.count({ where: where }),
        edges: prisma_client_1.prisma.event.findMany(
          __assign(__assign({}, findArgs), {
            where: where,
            orderBy: { startDate: 'asc' },
          })
        ),
      });
    },
  });
});
builder_1.builder.queryField('event', function (t) {
  return t.field({
    type: exports.EventObject,
    args: {
      uuid: (0, generic_args_1.uuidArg)(t),
    },
    resolve: function (_root, _a) {
      var uuid = _a.uuid;
      return prisma_client_1.prisma.event.findUnique({ where: { uuid: uuid } });
    },
  });
});
builder_1.builder.mutationField('createEvent', function (t) {
  return t.field({
    authScopes: { isAdmin: true },
    type: exports.EventObject,
    args: {
      title: t.arg.string(),
      description: t.arg.string({ required: false }),
      categoriesUuid: (0, generic_args_1.uuidArg)(t),
      startDate: t.arg({ type: 'Date' }),
      endDate: t.arg({ type: 'Date', required: false }),
      price: t.arg.float({ required: false }),
    },
    resolve: function (_, args) {
      return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
          return [
            2 /*return*/,
            prisma_client_1.prisma.event.create({
              data: {
                title: args.title,
                description: args.description,
                startDate: args.startDate,
                category: { connect: { uuid: args.categoriesUuid } },
                endDate: args.endDate,
                price:
                  (_a = args.price) !== null && _a !== void 0 ? _a : undefined,
              },
            }),
          ];
        });
      });
    },
  });
});
builder_1.builder.mutationField('updateEvent', function (t) {
  return t.field({
    type: exports.EventObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: (0, generic_args_1.uuidArg)(t),
      title: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
      price: t.arg.float({ required: false }),
      categoriesUuid: (0, generic_args_1.uuidArg)(t, false),
      startDate: t.arg({ type: 'Date', required: false }),
      endDate: t.arg({ type: 'Date', required: false }),
    },
    validate: function (_a) {
      var uuid = _a.uuid,
        rest = __rest(_a, ['uuid']);
      return Object.values(rest).some(function (value) {
        return value !== null || value !== undefined;
      });
    },
    resolve: function (_root, args) {
      return __awaiter(void 0, void 0, void 0, function () {
        var datas;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
          datas = {
            title: (_a = args.title) !== null && _a !== void 0 ? _a : undefined,
            description:
              (_b = args.description) !== null && _b !== void 0
                ? _b
                : undefined,
            startDate:
              (_c = args.startDate) !== null && _c !== void 0 ? _c : undefined,
            endDate:
              (_d = args.endDate) !== null && _d !== void 0 ? _d : undefined,
            price: (_e = args.price) !== null && _e !== void 0 ? _e : undefined,
          };
          if (args.categoriesUuid) {
            datas.category = { connect: { uuid: args.categoriesUuid } };
          }
          //TODO: Notify user who already booked of the changes
          return [
            2 /*return*/,
            prisma_client_1.prisma.event.update({
              where: { uuid: args.uuid },
              data: datas,
            }),
          ];
        });
      });
    },
  });
});
builder_1.builder.mutationField('deleteEvent', function (t) {
  return t.field({
    type: exports.EventObject,
    args: {
      uuid: (0, generic_args_1.uuidArg)(t),
    },
    authScopes: { isAdmin: true },
    resolve: function (_root, _a) {
      var uuid = _a.uuid;
      // TODO: Notify users
      // TODO: Refund converned users
      return prisma_client_1.prisma.event.delete({ where: { uuid: uuid } });
    },
  });
});
builder_1.builder.mutationField('joinEvent', function (t) {
  return t.field({
    deprecationReason: 'Not implemented yet',
    description: 'Pay to join the event',
    type: exports.EventObject,
    authScopes: { isLogged: true },
    args: {
      uuid: (0, generic_args_1.uuidArg)(t),
    },
    resolve: function () {
      throw new Error('Not implemented yet');
    },
  });
});
builder_1.builder.queryField('eventParticipants', function (t) {
  return t.field({
    type: user_resolver_1.UserConnection,
    args: __assign(
      { eventUuid: t.arg.string() },
      (0, pagination_args_1.cursorArgs)(t)
    ),
    resolve: function (_, args) {
      var findArgs = (0, pagination_args_1.generateCursorFindMany)(args);
      return (0, edge_resolver_1.createConnectionObject)({
        args: args,
        count: prisma_client_1.prisma.booking.count({
          where: { event: { uuid: args.eventUuid } },
        }),
        edges: prisma_client_1.prisma.user.findMany(
          __assign(__assign({}, findArgs), {
            where: { bookings: { some: { event: { uuid: args.eventUuid } } } },
          })
        ),
      });
    },
  });
});
