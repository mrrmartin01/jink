import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        //testing with mailtrap

        // const isProd = config.get('NODE_ENV') === 'production';

        // if (!isProd) {
        //   return {
        //     transport: {
        //       host: config.get('MAILTRAP_HOST'),
        //       port: config.get('MAILTRAP_PORT'),
        //       auth: {
        //         user: config.get('MAILTRAP_USER'),
        //         pass: config.get('MAILTRAP_PASS'),
        //       },
        //     },
        //     defaults: {
        //       from: '"Admin" admin@jink.com',
        //     },
        //   };
        // }

        //prod setup
        return {
          transport: {
            host: config.get('GMAIL_SMTP_HOST'),
            port: config.get('GMAIL_SMTP_PORT'),
            secure: true,
            auth: {
              user: config.get('GMAIL_SMTP_USER'),
              pass: config.get('GMAIL_SMTP_PASS'),
            },
          },
          defaults: {
            from: `"Admin" <${config.get('GMAIL_SMTP_USER')}>`,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
