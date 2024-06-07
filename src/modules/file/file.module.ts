import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/core/entities/Ad';
import { FileController } from './file.controller';
import { Image } from 'src/core/entities/Image';
import { JwtService } from '@nestjs/jwt';
import { Adservice } from '../ad/ad.service';
import { UserService } from '../user/user.service';
import { AdModule } from '../ad/ad.module';
import { AdType } from 'src/core/entities/AdType';
import { User } from 'src/core/entities/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad, Image, AdType, User]),
    forwardRef(() => AdModule),
  ],
  controllers: [FileController],
  providers: [JwtService, UserService],
  exports: [],
})
export class FileModule {}
