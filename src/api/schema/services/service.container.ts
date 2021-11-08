import { MailerService } from './mailer.service';

export class ServiceContainer {
  public get services() {
    return { mail: new MailerService() };
  }
}
