import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Code {
  @ObjectIdColumn()
  id: string;

  @Column() code: string;

  @OneToOne(() => User, (user) => user.code)
  user: User;

  constructor(code?: Partial<Code>) {
    Object.assign(this, code);
  }
}
