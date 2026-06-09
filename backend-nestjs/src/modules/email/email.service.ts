import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import {
  AuditService,
  EmailSender,
  ErrorLog,
  SendMailOptions,
  stringUtils,
} from 'mvc-common-toolkit';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { APP_ACTION, ENV_KEY, INJECTION_TOKEN } from '@shared/constants';

export interface SendMailWithTemplateOptions extends SendMailOptions {
  templatePath?: string;
  content?: Record<string, any>;
}

export class EmailService implements EmailSender {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    @Inject(INJECTION_TOKEN.MAIL_TRANSPORTER)
    protected transporter: nodemailer.Transporter,

    protected configService: ConfigService,
  ) {}

  public async send(mailOptions: SendMailWithTemplateOptions): Promise<void> {
    const logId = stringUtils.generateRandomId();

    try {
      let htmlContent = mailOptions.html;

      if (mailOptions.templatePath) {
        const templateFile = path.join(
          process.cwd(),
          'templates',
          `${mailOptions.templatePath}.template.ejs`,
        );

        try {
          const templateRaw = await fs.readFile(templateFile, 'utf-8');

          htmlContent = ejs.render(templateRaw, mailOptions.content || {});
        } catch (templateError) {
          this.logger.error(
            `Template compilation failed: ${templateFile}`,
            templateError.stack,
          );
          throw templateError;
        }
      }

      const smtpUsername = this.configService.get(ENV_KEY.SMTP_USERNAME);

      const fromAddress =
        mailOptions.from || `"Heartify Support" <${smtpUsername}>`;

      const info = await this.transporter.sendMail({
        ...mailOptions,
        from: fromAddress,
        html: htmlContent,
      });

      this.logger.log(
        `Email sent successfully. To: [${this.formatRecipients(mailOptions.to)}] | Subject: "${mailOptions.subject}" | MessageID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email. To: [${this.formatRecipients(mailOptions.to)}]. Error: ${error.message}`,
        error.stack,
      );

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: JSON.stringify(mailOptions, stringUtils.maskFn),
          action: APP_ACTION.SEND_EMAIL,
        }),
      );
    }
  }

  private formatRecipients(recipients?: string | string[]): string {
    if (!recipients) return 'Unknown';
    return Array.isArray(recipients) ? recipients.join(', ') : recipients;
  }
}
