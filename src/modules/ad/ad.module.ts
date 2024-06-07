import { UserService } from './../user/user.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/core/entities/User';
import { Ad } from 'src/core/entities/Ad';
import { AdType } from 'src/core/entities/AdType';
import { Image } from 'src/core/entities/Image';
import { AdController } from './ad.controller';
import { Adservice } from './ad.service';
import { AuthModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad, User, AdType, Image]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdController],
  providers: [Adservice, JwtService],
  exports: [Adservice],
})
export class AdModule {}
