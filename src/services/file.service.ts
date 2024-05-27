import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const bucket = this.firebase.storage.bucket();
    const filename = `${folder}/${uuid()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/jobhq-962c9.appspot.com/o/${encodeURIComponent(
      fileUpload.name,
    )}?alt=media`;

    return downloadUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    return unlink(filePath);
  }
}
