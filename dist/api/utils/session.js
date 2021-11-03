'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
exports.destroySession = exports.useSession = void 0;
var express_session_1 = __importDefault(require('express-session'));
exports.useSession = (0, express_session_1.default)({
  secret: (_a = process.env.SESSION_SECRET) !== null && _a !== void 0 ? _a : '',
  name: 'yvent-api',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
});
var destroySession = function (req) {
  return new Promise(function (res, rej) {
    req.session.destroy(function (err) {
      if (err) rej(err);
      res();
    });
  });
};
exports.destroySession = destroySession;
