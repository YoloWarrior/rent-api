import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from '../dtos/ResponseDto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    try {
      if (!token) {
        throw new UnauthorizedException('Неавторизован');
      }

      const tokenParts = token.split(' ');
      const tokenValue = tokenParts[1];
      const decodedToken: any = this.jwtService.decode(tokenValue);

      if (decodedToken && decodedToken?.email && decodedToken?.exp) {
        const currentTimestamp = Date.now() / 1000;

        if (decodedToken.exp < currentTimestamp) {
          throw new UnauthorizedException(
            'Срок действия токена авторизации истек, пожалуйста авторизуйтесь заново',
          );
        }

        request.email = decodedToken.email;
        request.id = decodedToken.id;

        return true;
      }

      throw new UnauthorizedException('Неавторизован');
    } catch (error) {
      const responseDto: ResponseDto<any> = {
        data: null,
        error: {
          message: error.message,
          status: error.getStatus(),
        },
      };

      context.switchToHttp().getResponse().status(responseDto.error.status);

      context.switchToHttp().getResponse().json(responseDto);

      return false;
    }
  }
}
