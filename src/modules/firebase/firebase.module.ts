import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { FirebaseModule } from 'nestjs-firebase';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule.forRoot({
      storageBucket: 'jobhq-962c9.appspot.com',
      googleApplicationCredential: require(join(
        __dirname,
        '../../../src/core/jobhq-962c9-firebase-adminsdk-ijm2c-cbe0d6418b.json',
      )),
    }),
  ],
})
export class FirebaseAdminModule {}
