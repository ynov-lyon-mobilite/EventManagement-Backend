'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isOwnerOrAdmin = void 0;
var isOwnerOrAdmin = function (ressourceUuid, user) {
  if (!user) return false;
  return ressourceUuid === user.uuid || user.roles.includes('ADMIN');
};
exports.isOwnerOrAdmin = isOwnerOrAdmin;
