import {
  Entity,
  Column,
  OneToMany,
  ObjectIdColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { AdType } from './AdType';
import { Image } from './Image';
import 'reflect-metadata';

@Entity()
export class Ad {
  @ObjectIdColumn()
  id: string;

  @Column() title: string;
  @Column() description: string;
  @Column() price: number;
  @Column() priority: string;
  @Column() street: string;
  @Column() geo: number[];
  @Column() rooms: number;
  @Column() house: string;
  @Column() square: number;
  @Column() floor: number;
  @Column() userId: string;

  @ManyToOne(() => User, (user) => user.ads, { eager: true })
  user: User;

  @ManyToOne(() => AdType, (adType) => adType.ads, { eager: true })
  @Column()
  adType: AdType;

  @OneToMany(() => Image, (image) => image.ad)
  @Column({ nullable: true })
  images: Image[];

  constructor(ad?: Partial<Ad>) {
    Object.assign(this, ad);
  }
}
