import * as bcrypt from 'bcrypt';

import { PasswordService } from '../../application/services/password.service';

export class BcryptPasswordService extends PasswordService {
  constructor() {
    super();
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
