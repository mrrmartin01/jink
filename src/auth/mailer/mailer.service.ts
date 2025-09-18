/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as Crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivateEmailTemplate } from './templates/activateEmail';
import { resetPasswordTemplate } from './templates/resetPassword';
import { welcomeEmailTemplate } from './templates';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  async sendActivationEmail(email: string) {
    const code = Crypto.randomInt(1000, 9999).toString();
    const html = ActivateEmailTemplate(code);

    await this.prisma.verifications.create({
      data: { email, code, expiresAt: new Date(Date.now() + 1000 * 60 * 10) }, // 10 minutes
    });

    await this.mailer.sendMail({
      to: email,
      subject: 'Verify your account',
      text: `Your verification code is ${code}`,
      html,
    });
  }

  async welcomeUser(email: string, username: string) {
    const homepage = this.config.get('FRONTEND_URL');
    const html = welcomeEmailTemplate(username, homepage);
    await this.mailer.sendMail({
      to: email,
      subject: 'Welcome to Jink',
      text: `Welcome aboard, ${username}! We're excited to have you with us.`,
      html,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = resetPasswordTemplate(url);
    console.log(url);

    await this.mailer.sendMail({
      to: email,
      subject: 'Password Reset',
      html,
    });
  }
}
