import { Entity, EntityProps } from 'src/shared/ddd';

interface TokenProps extends EntityProps {
  accountId: string;
  value: string;
  expiresAt: Date;
}

export class Token extends Entity<TokenProps> {
  private constructor(props: TokenProps) {
    super(props);
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get value(): string {
    return this.props.value;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  static create(props: TokenProps): Token {
    return new Token(props);
  }
}
