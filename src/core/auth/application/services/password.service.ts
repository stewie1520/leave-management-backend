export abstract class PasswordService {
  abstract comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;

  abstract hashPassword(password: string): Promise<string>;
}
