import {Account} from '../model/Account';

export default interface GetSenderAccount {
  get(): Promise<Account>;
}
