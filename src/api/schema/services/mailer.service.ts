import { createTransport } from 'nodemailer';
import { Template, templates } from '@api/templates/mail';

export const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT!),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export class MailerService {
  public async send<T extends Template>(
    to: string,
    subject: string,
    template: T,
    opts: Parameters<typeof templates[T]>[0]
  ): Promise<void> {
    try {
      await transport.sendMail({
        to,
        from: process.env.MAIL_FROM,
        subject,
        html: templates[template](opts as any).html,
      });
      console.info(`Sent email to ${to} at ${new Date().toLocaleString()}`);
    } catch (error) {
      console.error("Couldn't send email", error);
    }
  }
}
