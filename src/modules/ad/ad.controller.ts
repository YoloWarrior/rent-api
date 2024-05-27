import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Param,
  Put,
  Request,
  UploadedFiles,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/dtos/ResponseDto';
import { EmailService } from '../email/email.service';
import { AuthGuard } from 'src/core/guards/AuthGuard';
import { EditUserDto } from 'src/core/dtos/UserDto';
import { CreateAdDto } from 'src/core/dtos/AdDto';
import { Adservice } from './ad.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';

@Controller('ad')
export class AdController {
  constructor(
    private readonly adService: Adservice,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createAd(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() ad: CreateAdDto,
    @Request() req,
  ) {
    return await this.adService.createAd(ad, images, req.id);
  }

  @Get()
  @HttpCode(200)
  async getAds() {
    const result = await this.adService.getAllAds();
    return new ResponseDto(result);
  }

  @Get('/:id')
  @HttpCode(200)
  async getAdById(@Param('id') id) {
    const result = await this.adService.findBy({ id });
    const user = await this.userService.findBy({ id: result.userId });

    return new ResponseDto({
      ...result,
      images: result.images?.map((x) => x.url),
      phone: user?.phone,
      mail: user?.email,
      name: user?.firstName,
      adType: result?.adType?.title,
    });
  }
}
