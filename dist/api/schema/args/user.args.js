'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.emailArg = exports.passwordArg = exports.usernameArg = void 0;
var usernameArg = function (t, required) {
  if (required === void 0) {
    required = true;
  }
  return t.arg.string({ validate: { minLength: 4 }, required: required });
};
exports.usernameArg = usernameArg;
var passwordArg = function (t, required) {
  if (required === void 0) {
    required = true;
  }
  return t.arg.string({ validate: { minLength: 4 }, required: required });
};
exports.passwordArg = passwordArg;
var emailArg = function (t, required) {
  if (required === void 0) {
    required = true;
  }
  return t.arg.string({ validate: { email: true }, required: required });
};
exports.emailArg = emailArg;
