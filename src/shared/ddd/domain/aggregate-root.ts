import {
  EventPublisher,
  AggregateRoot as NestAggregateRoot,
} from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { DomainEvent, EntityProps } from '.';

export abstract class AggregateRoot<
  Props extends EntityProps = EntityProps,
> extends NestAggregateRoot<DomainEvent> {
  private readonly _id: string;

  constructor(protected props: Props) {
    super();
    this._id = props.id ? props.id : randomUUID();
    this.props.id = this._id;
  }

  get id() {
    return this._id;
  }

  public equals(object?: AggregateRoot<Props>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof AggregateRoot)) {
      return false;
    }

    return this.id === object.id;
  }

  public mergeContext(eventPublisher: EventPublisher) {
    eventPublisher.mergeObjectContext(this);
  }
}
