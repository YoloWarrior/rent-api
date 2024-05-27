import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { ObjectId } from 'mongodb';

type SearchField<T> = keyof T | { [K in keyof T]?: SearchField<T[K]> };

export class GenericService<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(
    conditions: FindOptionsWhere<T>,
    relations: FindOptionsRelations<T> = null,
    skip = 0,
    take = 20,
  ): Promise<{ items: T[]; hasMore: boolean }> {
    const items = await this.repository.find({
      where: conditions,
      relations,
      skip: skip,
      take: take + 1,
    });

    const hasMore = items?.length > take;
    if (hasMore) {
      items.pop();
    }

    return { items, hasMore };
  }

  async search(searchText: string, searchFields: string[]) {
    const queryBuilder = this.repository.createQueryBuilder('alias');
    const whereSearch: FindOptionsWhere<T> = {};
    searchFields.forEach((field) => {
      if (field.includes('.')) {
        const [relation, property] = field.split('.');
        whereSearch[`${relation}.${property}`] = ILike(`%${searchText}%`);
      } else {
        whereSearch[`${field}` as string] = ILike(`%${searchText}%`);
      }
    });
    queryBuilder.andWhere(whereSearch);
    const [items, totalCount] = await queryBuilder.getManyAndCount();
    return { items, totalCount };
  }

  async findById(id: string): Promise<T | undefined> {
    return this.repository.findOne({ where: { id: new ObjectId(id) } } as any);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }

  async findBy(
    conditions: FindOptionsWhere<T | any>,
    relations: FindOptionsRelations<T> = null,
  ) {
    if (conditions && conditions['id']) {
      // Convert the id to ObjectId if it's a valid ObjectId string
      conditions['_id'] = new ObjectId(conditions['id']);
      delete conditions['id'];
    }

    return this.repository.findOne({ where: conditions, relations });
  }

  async update(id: string, data: DeepPartial<T>) {
    const obj = await this.findById(id);
    await this.repository.update(obj['id'], data as any);

    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
