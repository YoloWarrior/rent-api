import { Column, ManyToOne, OneToMany } from 'typeorm';
import { AdType } from '../entities/AdType';
import { User } from '../entities/User';
import { OmitType } from '@nestjs/mapped-types';

export class AdDto {
  id: string;
  title: string;
  description: string;
  price: number;
  street: string;
  house: string;
  rooms: number;
  geo: number[];
  square: number;
  type: string;
  priority: string;
  floor: number;
  images: string[];
  phone?: string;
  email?: string;
  name?: string;
}

export class CreateAdDto extends OmitType(AdDto, ['id'] as const) {}
