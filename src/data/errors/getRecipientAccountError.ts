export default class GetRecipientAccountError extends Error {
  constructor() {
    super();
    this.message = 'Try to get account again.';
    this.name = 'GetRecipientAccountError';
  }
}
