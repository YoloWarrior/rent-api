import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/dtos/ResponseDto';
import { AuthGuard } from 'src/core/guards/AuthGuard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Adservice } from '../ad/ad.service';

@Controller('file')
export class FileController {
  constructor(private readonly adService: Adservice) {}

  @Post('remove')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async deleteImage(@Body() { url, adId }) {
    await this.adService.deleteImage(url, adId);

    return new ResponseDto(true);
  }

  @Post('create')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async addImage(
    @UploadedFiles() image: Express.Multer.File[],
    @Body() { id },
  ) {
    await this.adService.addImage(id, image[0]);

    return new ResponseDto(true);
  }
}
