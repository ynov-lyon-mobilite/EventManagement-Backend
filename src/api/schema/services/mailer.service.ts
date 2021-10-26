import { createTransport } from 'nodemailer';

export const transport = createTransport({ host: 'localhost', port: 25 });

export const MailerService = {};
