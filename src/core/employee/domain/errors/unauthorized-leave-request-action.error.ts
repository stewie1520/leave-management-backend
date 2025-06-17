export class UnauthorizedLeaveRequestActionError extends Error {
  constructor() {
    super('Only managers can approve or reject leave requests');
    this.name = 'UnauthorizedLeaveRequestActionError';
  }
}
