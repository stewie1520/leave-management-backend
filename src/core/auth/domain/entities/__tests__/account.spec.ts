import { Account } from '../account.entity';

describe(Account.name, () => {
  describe('validatePassword', () => {
    it('should return true when password is valid', () => {
      expect(() =>
        Account.create({
          email: 'test@test.com',
          password: 'Password@123',
        }),
      ).not.toThrow();
    });

    it('should return false when password is invalid', () => {
      const invalidPasswords = [
        'missing-uppercase-@123',
        'tooshort',
        'missing-number',
        'missingspecialchar1',
      ];

      for (const password of invalidPasswords) {
        expect(() =>
          Account.create({
            email: 'test@test.com',
            password,
          }),
        ).toThrow();
      }
    });
  });
});
