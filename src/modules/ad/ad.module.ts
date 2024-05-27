import { UserService } from './../user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/core/entities/User';
import { Ad } from 'src/core/entities/Ad';
import { AdType } from 'src/core/entities/AdType';
import { Image } from 'src/core/entities/Image';
import { AdController } from './ad.controller';
import { Adservice } from './ad.service';
import { FileUploadService } from 'src/services/file.service';
import { AuthModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User, AdType, Image])],
  controllers: [AdController],
  providers: [Adservice, FileUploadService, UserService, JwtService],
  exports: [Adservice],
})
export class AdModule {}
