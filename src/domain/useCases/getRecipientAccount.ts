import {Account} from '../model/Account';

export default interface GetRecipientAccount {
  get(): Promise<Account>;
}
