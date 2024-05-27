import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ObjectIdColumn,
} from 'typeorm';
import { Code } from './Code';
import { Ad } from './Ad';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column({ nullable: true }) firstName: string;
  @Column({ nullable: true }) lastName?: string;

  @Column() email: string;

  @Column() balance: number;

  @Column({ nullable: true }) phone: string;

  @OneToMany(() => Ad, (ad) => ad.user)
  @Column()
  ads: Ad[];

  @OneToOne(() => Code, (code) => code.user)
  @Column({ nullable: true })
  code: Code;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
