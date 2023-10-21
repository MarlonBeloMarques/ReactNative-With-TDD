export default class GetSenderAccountError extends Error {
  constructor() {
    super();
    this.message = 'Try to get account again.';
    this.name = 'GetSenderAccountError';
  }
}
