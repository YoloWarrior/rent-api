import { Column, Entity, ObjectIdColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './User';
import { Ad } from './Ad';

@Entity()
export class AdType {
  @ObjectIdColumn()
  id: string;

  @Column() title: string;

  @OneToMany(() => Ad, (ad) => ad.adType)
  ads: Ad[];

  constructor(adType?: Partial<AdType>) {
    Object.assign(this, adType);
  }
}
