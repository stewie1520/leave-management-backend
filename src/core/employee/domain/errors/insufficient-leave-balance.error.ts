export class InsufficientLeaveBalanceError extends Error {
  constructor() {
    super('Insufficient leave balance');
    this.name = InsufficientLeaveBalanceError.name;
  }
}
