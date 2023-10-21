import {Account} from '../model/Account';

export default interface SendMoney {
  sendTo(account: Account, amount: number): Promise<void>;
}
