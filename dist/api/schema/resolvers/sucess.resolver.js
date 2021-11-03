'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SuccessObject = void 0;
var builder_1 = require('src/api/schema/builder');
exports.SuccessObject = builder_1.builder.objectRef('Success').implement({
  fields: function (t) {
    return { success: t.exposeBoolean('success', {}) };
  },
});
