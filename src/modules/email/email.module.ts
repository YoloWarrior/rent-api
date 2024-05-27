import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerConfig } from './email.config';
import { User } from 'src/core/entities/User';
import { Code } from 'src/core/entities/Code';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Ad } from 'src/core/entities/Ad';
import { AdType } from 'src/core/entities/AdType';
import { Image } from 'src/core/entities/Image';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ad, AdType, Image, Code]),
    MailerModule.forRootAsync({
      useClass: MailerConfig,
    }),
  ],
  providers: [EmailService, UserService, JwtService],
  exports: [EmailService],
})
export class EmailModule {}
