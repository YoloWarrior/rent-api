import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdDto, CreateAdDto } from 'src/core/dtos/AdDto';
import { Ad } from 'src/core/entities/Ad';
import { AdType } from 'src/core/entities/AdType';
import { Image } from 'src/core/entities/Image';
import { User } from 'src/core/entities/User';
import { GenericService } from 'src/services/generetic.service';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserService } from '../user/user.service';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import { ObjectId } from 'mongodb';

@Injectable()
export class Adservice extends GenericService<Ad> {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    private userService: UserService,
    @InjectRepository(AdType) private adTypeRepository: Repository<AdType>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {
    super(adRepository);
  }

  async createAd(
    ad: CreateAdDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const user = await this.userService.findBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const adType = await this.adTypeRepository.findOneBy({ title: ad.type });
    if (!adType) {
      throw new Error('AdType not found');
    }

    const images = [];

    for (const file of files) {
      const filePath = await this.saveFile(file, 'ads');
      const image = this.imageRepository.create({ id: uuid(), url: filePath });
      await this.imageRepository.save(image);
      images.push(image);
    }

    const adData = this.adRepository.create({
      ...ad,
      userId: user?.id,
      user,
      adType,
      images,
    });

    return this.adRepository.save({ id: uuid(), ...adData, priority: '1' });
  }

  async updateAd(
    id: string,
    {
      title,
      house,
      street,
      square,
      geo,
      price,
      priority,
      floor,
      rooms,
      description,
      type,
    }: AdDto,
  ): Promise<Ad> {
    const ad = await this.findBy(
      { id },
      { images: true, user: true, adType: true },
    );
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const adType = await this.adTypeRepository.findOneBy({ title: type });
    if (!adType) {
      throw new Error('AdType not found');
    }

    return this.adRepository.save({
      ...ad,
      title,
      house,
      street,
      square,
      geo,
      adType,
      price,
      priority,
      floor,
      rooms,
      description,
    });
  }

  async getAllAds(): Promise<AdDto[]> {
    const ads = await this.adRepository.find({
      relations: {
        images: true,
        adType: true,
      },
    });

    const adsResult = ads
      .map((ad) => {
        return {
          ...ad,
          type: ad.adType?.title,
          images: ad.images.map((x) => x.url),
        };
      })
      ?.reverse();

    return adsResult.sort((x, y) => +x.priority - +y.priority);
  }

  async setPriorityByUser(userId: string, priority = '1') {
    const user = await this.userService.findBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userService.create({
      ...user,
      payed: priority === '0' ? true : false,
      balance: user.balance - 20,
    });

    const id = new ObjectId(userId);

    const ads = (
      await this.findAll(
        { userId: id as any },
        { adType: true, images: true, user: true },
      )
    ).items;

    ads.forEach((ad) => {
      this.create({ ...ad, priority: priority.toString() });
    });
  }

  async deleteAd(id: string): Promise<void> {
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    // Delete associated images
    for (const image of ad.images) {
      await this.deleteFile(image.url);
      await this.imageRepository.delete(image.id);
    }

    await this.adRepository.delete(id);
  }

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

  async deleteFile(downloadUrl: string): Promise<void> {
    const bucket = this.firebase.storage.bucket();
    const filePath = this.extractFilePathFromUrl(downloadUrl);
    await bucket.file(filePath).delete();
  }

  async addImage(adId: string, file: Express.Multer.File) {
    const ad = await this.findBy(
      { id: adId },
      { images: true, adType: true, user: true },
    );
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    ad.images = ad?.images ?? [];

    if (file) {
      const filePath = await this.saveFile(file, 'ads');
      const image = this.imageRepository.create({
        id: uuid(),
        url: filePath,
      });
      await this.imageRepository.save(image);

      ad.images.push(image);
    }

    return this.adRepository.save(ad);
  }

  async deleteImage(url, adId) {
    const ad = await this.findBy(
      { id: adId },
      { images: true, adType: true, user: true },
    );
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const images = ad.images ?? [];

    const imageIndex = images.findIndex((x) => x.url === url);

    images.splice(imageIndex, 1);

    await this.deleteFile(url);

    const image = await this.imageRepository.findOneBy({ url });

    if (image) {
      await this.create({ ...ad, images });
      await this.imageRepository.delete(image.id);
    }
  }

  private extractFilePathFromUrl(url: string): string {
    const match = url.match(/\/o\/(.+?)\?alt=media/);
    if (!match || match.length < 2) {
      throw new Error('Invalid download URL');
    }
    return decodeURIComponent(match[1]);
  }
}
