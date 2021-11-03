'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var builder_1 = require('../builder');
builder_1.builder.queryField('isAlive', function (t) {
  return t.boolean({
    resolve: function () {
      return true;
    },
  });
});
builder_1.builder.queryField('ping', function (t) {
  return t.string({
    resolve: function () {
      return 'pong';
    },
  });
});
