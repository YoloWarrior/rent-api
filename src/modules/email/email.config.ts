import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';

export class MailerConfig implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'kriterwodern@gmail.com',
          pass: 'ofdf jnts jbkk odcd',
        },
      },
    };
  }
}
