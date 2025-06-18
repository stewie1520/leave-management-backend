import { LeaveBalance } from '../leave-balance.entity';

describe(LeaveBalance.name, () => {
  it('should throw error if totalDays is negative', () => {
    expect(() =>
      LeaveBalance.create({
        totalDays: -1,
        usedDays: 10,
      }),
    ).toThrowError('Total days cannot be negative');
  });

  it('should throw error if usedDays is negative', () => {
    expect(() =>
      LeaveBalance.create({
        totalDays: 10,
        usedDays: -1,
      }),
    ).toThrowError('Used days cannot be negative');
  });

  it('should throw error if totalDays is less than usedDays', () => {
    expect(() =>
      LeaveBalance.create({
        totalDays: 5,
        usedDays: 10,
      }),
    ).toThrowError('Used days cannot exceed total days');
  });

  it('availableDays should be totalDays - usedDays', () => {
    const totalDays = Math.floor(Math.random() * 100);
    const usedDays = Math.min(totalDays, Math.floor(Math.random() * totalDays));
    const leaveBalance = LeaveBalance.create({
      totalDays,
      usedDays,
    });

    expect(leaveBalance.availableDays).toBe(totalDays - usedDays);
  });
});
