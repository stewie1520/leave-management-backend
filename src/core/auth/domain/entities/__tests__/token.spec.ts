import { Token } from '../token.entity';

describe(Token.name, () => {
  describe('isExpired', () => {
    it('should return true if the token is expired', () => {
      const token = Token.create({
        value: 'test',
        expiresAt: new Date(Date.now() - 1000),
        accountId: 'user123',
      });

      expect(token.isExpired).toBe(true);
    });

    it('should return false if the token is not expired', () => {
      const token = Token.create({
        value: 'test',
        expiresAt: new Date(Date.now() + 1000),
        accountId: 'user123',
      });

      expect(token.isExpired).toBe(false);
    });
  });
});
