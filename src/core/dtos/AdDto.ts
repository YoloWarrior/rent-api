import { Column, ManyToOne, OneToMany } from 'typeorm';
import { AdType } from '../entities/AdType';
import { User } from '../entities/User';
import { OmitType } from '@nestjs/mapped-types';

export class AdDto {
  id: string;
  title: string;
  description: string;
  price: number;
  priority = 1;
  street: string;
  house: string;
  rooms: number;
  geo: number[];
  square: number;
  type: string;
  floor: number;
  images: string[];
  phone?: string;
  email?: string;
  name?: string;
}

export class EditAdDto extends OmitType(AdDto, ['priority', 'geo'] as const) {}
export class CreateAdDto extends OmitType(EditAdDto, ['id'] as const) {}
