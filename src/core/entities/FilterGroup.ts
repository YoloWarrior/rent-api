import { Column, Entity, ObjectIdColumn, OneToMany, OneToOne } from 'typeorm';
import { Filter } from './Filter';

@Entity()
export class FilterGroup {
  @ObjectIdColumn()
  id: string;

  @Column() title: string;

  @Column() value: string;

  @OneToOne(() => Filter, (filter) => filter.filterGroup)
  filter: Filter;

  constructor(filter?: Partial<Filter>) {
    Object.assign(this, filter);
  }
}
