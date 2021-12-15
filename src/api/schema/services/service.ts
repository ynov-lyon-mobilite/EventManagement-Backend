import { MailerService } from './mailer.service';

export class Service {
  get mail() {
    return new MailerService();
  }
}
