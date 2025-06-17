import { randomUUID } from 'crypto';

export type EntityProps = {
  id?: string;
};

export abstract class Entity<P extends EntityProps = EntityProps> {
  private readonly _id: string;

  constructor(protected props: P) {
    this._id = props.id ? props.id : randomUUID();
    this.props.id = this._id;
  }

  get id() {
    return this._id;
  }

  public equals(object?: Entity<P>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this.id === object.id;
  }

  public getProps(): P {
    return this.props;
  }
}
