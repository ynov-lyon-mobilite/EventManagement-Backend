'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.objectInput = exports.objectArgs = exports.uuidArg = void 0;
var uuidArg = function (t, required) {
  if (required === void 0) {
    required = true;
  }
  return t.arg.string({ validate: { uuid: true }, required: required });
};
exports.uuidArg = uuidArg;
// export const objectArgs = <B = keyof {}>(opts: {
//   [P in string & keyof B]?: InputFieldRef<B[P], 'Arg'>;
// }) => opts;
var objectArgs = function (opts) {
  return opts;
};
exports.objectArgs = objectArgs;
var objectInput = function (opts) {
  return opts;
};
exports.objectInput = objectInput;
// function createPerson<D extends keyof Person>(
//   personData: Pick<Person, D>
// ): Pick<Person, D> & AdditionalProperties {
//   return Object.assign({}, personData, { groups: [] });
// }
