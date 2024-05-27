import { Column, Entity, ManyToOne, ObjectIdColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { Ad } from './Ad';

@Entity()
export class Image {
  @ObjectIdColumn()
  id: string;

  @Column() url: string;

  @ManyToOne(() => Ad, (ad) => ad.images)
  ad: Ad;

  constructor(image?: Partial<Image>) {
    Object.assign(this, image);
  }
}
