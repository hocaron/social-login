import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

type MailSendPayload = {
  to: string;
  subject: string;
  text: string;
};

@Injectable()
export class MailSender {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      this.configService.get('mail'),
    );
  }

  async send({ subject, text, to }: MailSendPayload): Promise<void> {
    const email = this.configService.get('mail.auth.user') + '@gmail.com';
    return await this.transporter.sendMail({
      from: email,
      to,
      subject,
      text,
    });
  }
}
