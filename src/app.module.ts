import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/user/user.module';
import { AdModule } from './modules/ad/ad.module';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import { FirebaseAdminModule } from './modules/firebase/firebase.module';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://kritertema:123asd123Aa@cluster0.uxzxqmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      database: 'rent',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register(),
    FirebaseAdminModule,
    FileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
