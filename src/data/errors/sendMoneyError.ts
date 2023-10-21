export default class SendMoneyError extends Error {
  constructor() {
    super();
    this.message = 'Try to send money again.';
    this.name = 'SendMoneyError';
  }
}
