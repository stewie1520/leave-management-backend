import { IEvent } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class DomainEvent implements IEvent {
  constructor(public readonly id: string = randomUUID()) {}
}
