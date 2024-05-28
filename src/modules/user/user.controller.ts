import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Param,
  Put,
  Request,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseDto } from 'src/core/dtos/ResponseDto';
import { EmailService } from '../email/email.service';
import { AuthGuard } from 'src/core/guards/AuthGuard';
import { UserDto } from 'src/core/dtos/UserDto';
import { AdDto } from 'src/core/dtos/AdDto';
import { Adservice } from '../ad/ad.service';
import { ObjectId } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly adService: Adservice,
  ) {}

  @Post('send-code')
  @HttpCode(200)
  async login(@Body() { email }) {
    const isUserExist = await this.emailService.sendVerificationCode(email);

    return new ResponseDto<boolean>(isUserExist);
  }

  @Post('confirm-code')
  @HttpCode(200)
  async confirmCode(@Body() { email, code }) {
    const isConfirm = await this.emailService.checkVerificationCode(
      email,
      code,
    );

    return new ResponseDto(
      isConfirm ? await this.userService.generateAccessToken(email) : null,
      !isConfirm
        ? {
            status: 401,
            message: 'Неправильный код',
          }
        : null,
    );
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getUserInfo(@Request() req) {
    const user = await this.userService.getUserInfo(req.id);
    const ads = (
      await this.adService.findAll(
        { userId: user.id },
        { adType: true, images: true, user: true },
      )
    ).items;

    return new ResponseDto({
      firstName: user?.firstName,
      lastName: user?.lastName,
      balance: user?.balance,
      ads: ads
        ? ads.map((ad) => {
            return {
              ...ad,
              square: ad.square,
              rooms: ad.rooms,
              userId: req.id,
              type: ad.adType.title,
              images: ad?.images?.map((x) => x.url),
            } as AdDto;
          })
        : [],
      email: user?.email,
      phone: user?.phone,
    } as UserDto);
  }

  @Put()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async editUser(@Body() { user }, @Request() req) {
    const userResult = await this.userService.update(req.id, {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      balance: user?.balance ?? 0,
    });

    return new ResponseDto(
      userResult,
      !userResult
        ? {
            status: 501,
            message: 'Ошибка',
          }
        : null,
    );
  }
}
