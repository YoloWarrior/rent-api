import { OmitType } from '@nestjs/mapped-types';
import { AdDto } from './AdDto';

export class UserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  payed: boolean;
  phone: string;
  balance: number;
  ads: AdDto[];
}

export class EditUserDto extends OmitType(UserDto, ['email', 'ads'] as const) {}
