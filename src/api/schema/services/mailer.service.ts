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
  private isDisabled(): boolean {
    return Boolean(process.env.DISABLE_MAIL);
  }

  public async send<T extends Template>(
    to: string,
    subject: string,
    template: T,
    opts: Parameters<typeof templates[T]>[0]
  ): Promise<void> {
    if (this.isDisabled()) return Promise.resolve();
    await transport.sendMail({
      to,
      subject,
      html: templates[template](opts as any).html,
    });

    console.info(`Sent email to ${to} at ${new Date().toLocaleDateString()}`);
  }
}
