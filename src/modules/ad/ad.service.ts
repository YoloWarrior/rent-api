import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdDto, CreateAdDto, EditAdDto } from 'src/core/dtos/AdDto';
import { Ad } from 'src/core/entities/Ad';
import { AdType } from 'src/core/entities/AdType';
import { Image } from 'src/core/entities/Image';
import { User } from 'src/core/entities/User';
import { FileUploadService } from 'src/services/file.service';
import { GenericService } from 'src/services/generetic.service';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserService } from '../user/user.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class Adservice extends GenericService<Ad> {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    private userService: UserService,
    @InjectRepository(AdType) private adTypeRepository: Repository<AdType>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    private readonly fileUploadService: FileUploadService,
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
      const filePath = await this.fileUploadService.saveFile(file, 'ads');
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

    return this.adRepository.save({ id: uuid(), ...adData });
  }

  async updateAd(
    id: string,
    updateAdDto: EditAdDto,
    userId: string,
    imageFiles?: Express.Multer.File[],
  ): Promise<Ad> {
    const ad = await this.adRepository.findOneBy({ id });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (imageFiles && imageFiles.length > 0) {
      const images = [];
      for (const file of imageFiles) {
        const filePath = await this.fileUploadService.saveFile(file, 'ads');
        const image = this.imageRepository.create({
          id: uuid(),
          url: filePath,
        });
        await this.imageRepository.save(image);
        images.push(image);
      }
      ad.images = images;
    }

    Object.assign(ad, updateAdDto);
    return this.adRepository.save(ad);
  }

  async getAllAds(): Promise<AdDto[]> {
    const ads = await this.adRepository.find({
      relations: {
        images: true,
        adType: true,
      },
    });

    return ads.map((ad) => {
      return {
        ...ad,
        type: ad.adType?.title,
        images: ad.images.map((x) => x.url),
      };
    }) as AdDto[];
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
      await this.fileUploadService.deleteFile(image.url);
      await this.imageRepository.delete(image.id);
    }

    await this.adRepository.delete(id);
  }
}
