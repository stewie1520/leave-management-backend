export abstract class PasswordService {
  abstract comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
