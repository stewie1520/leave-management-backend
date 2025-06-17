export class LeaveRequestNotFoundError extends Error {
  constructor() {
    super('Leave request not found');
    this.name = 'LeaveRequestNotFoundError';
  }
}
