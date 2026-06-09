import { MailService } from 'mvc-common-toolkit';
import * as nodemailer from 'nodemailer';

import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';

import { EmailService } from './email.service';

const mailTransporterProvider: Provider = {
  provide: INJECTION_TOKEN.MAIL_TRANSPORTER,
  useFactory: (configService: ConfigService) => {
    const host = configService.getOrThrow(ENV_KEY.SMTP_HOST);
    const port = Number(configService.getOrThrow(ENV_KEY.SMTP_PORT));
    const secureRaw = configService.get(ENV_KEY.SMTP_SECURE);
    const isSecure = secureRaw === true || secureRaw === 'true';

    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: isSecure,
      name: host.split('.').slice(1).join('.'),
      auth: {
        user: configService.getOrThrow(ENV_KEY.SMTP_USERNAME),
        pass: configService.getOrThrow(ENV_KEY.SMTP_PASSWORD),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  },
  inject: [ConfigService],
};

export const mailServiceProvider: Provider = {
  provide: MailService,
  useFactory: (emailSender: EmailService, configService: ConfigService) => {
    const adminEmailsRaw = String(configService.get(ENV_KEY.ADMIN_EMAILS));
    const adminEmails = adminEmailsRaw
      ? adminEmailsRaw.split(',').map((e) => e.trim())
      : [];

    return new MailService(emailSender, {
      adminEmails: adminEmails,
    });
  },
  inject: [EmailService, ConfigService],
};

@Global()
@Module({
  providers: [mailTransporterProvider, EmailService, mailServiceProvider],
  exports: [MailService, EmailService],
})
export class EmailModule {}
