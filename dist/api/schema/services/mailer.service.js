'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MailerService = exports.transport = void 0;
var nodemailer_1 = require('nodemailer');
exports.transport = (0, nodemailer_1.createTransport)({
  host: 'localhost',
  port: 25,
});
exports.MailerService = {};
