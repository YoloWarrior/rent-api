import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entities/User';
import { GenericService } from 'src/services/generetic.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async login(email: string) {
    const user = await this.findBy({
      email: email.toLocaleLowerCase(),
    });

    if (user) {
      return this.generateAccessToken(user);
    }

    return null;
  }

  async getUserInfo(userId: string) {
    const user = await this.findBy(
      {
        id: userId,
      },
      {
        ads: true,
        code: false,
      },
    );

    return user;
  }

  async generateAccessToken(email) {
    const user = await this.findBy({
      email: email.toLocaleLowerCase(),
    });
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + 24 * 60 * 60;

    const payload = {
      email: user.email,
      id: user.id,
      exp: expirationTimestamp,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'yareyaredaze',
      }),
    };
  }
}
