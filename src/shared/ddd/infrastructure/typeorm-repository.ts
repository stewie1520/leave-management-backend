import { DataSource, EntityManager, ObjectLiteral } from 'typeorm';

import { Repository } from '../application';
import { AggregateRoot, EntityProps } from '../domain';

export abstract class TypeormRepository<
  DomainAggregateRoot extends AggregateRoot<EntityProps>,
  OrmModel extends ObjectLiteral,
> extends Repository<DomainAggregateRoot> {
  protected abstract modelToAggregateRoot(model: OrmModel): DomainAggregateRoot;
  protected abstract aggregateRootToModel(
    aggregate: DomainAggregateRoot,
  ): OrmModel;

  protected manager: EntityManager;

  constructor(
    dataSource: DataSource,
    protected modelName: string,
  ) {
    super();

    this.manager = dataSource.manager;
  }

  async findOne(id: string): Promise<DomainAggregateRoot | null> {
    const model = (await this.manager.findOne(this.modelName, {
      where: { id },
    })) as OrmModel | null;

    return model ? this.modelToAggregateRoot(model) : null;
  }

  async save(entity: DomainAggregateRoot): Promise<DomainAggregateRoot> {
    const model = this.aggregateRootToModel(entity);

    await this.manager.save(model);

    return this.modelToAggregateRoot(model);
  }
}
