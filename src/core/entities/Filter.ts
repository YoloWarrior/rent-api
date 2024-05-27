import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm';
import { FilterGroup } from './FilterGroup';

@Entity()
export class Filter {
  @ObjectIdColumn()
  id: string;

  @Column() title: string;

  @OneToOne(() => FilterGroup, (filter) => filter.filter)
  filterGroup: FilterGroup;

  constructor(filter?: Partial<Filter>) {
    Object.assign(this, filter);
  }
}
