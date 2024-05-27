import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { UserService } from './user.service';
import { User } from 'src/core/entities/User';
import { Code } from 'src/core/entities/Code';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { Ad } from 'src/core/entities/Ad';
import { Adservice } from '../ad/ad.service';
import { AdModule } from '../ad/ad.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ad, Code]), EmailModule, AdModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class AuthModule {}
