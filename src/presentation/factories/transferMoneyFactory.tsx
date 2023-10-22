import React from 'react';
import TransferMoney from '../transferMoney';
import useTransferMoney from '../transferMoney/useTransferMoney';
import SendMoney from '../../domain/useCases/sendMoney';
import {Account} from '../transferMoney/model';
import GetSenderAccount from '../../domain/useCases/getSenderAccount';
import {faker} from '@faker-js/faker';
import GetRecipientAccount from '../../domain/useCases/getRecipientAccount';
import GetSenderAccountError from '../../data/errors/getSenderAccountError';

const makeAccount = (): Account => {
  return {
    agency: faker.finance.accountNumber(),
    currentAccount: faker.finance.accountNumber(),
    profilePhoto: faker.image.avatar(),
    userName: faker.person.firstName(),
  };
};

class SendMoneyDAO implements SendMoney {
  constructor(private readonly senderAccount: Account) {}

  async sendTo(account: Account, amount: number) {
    console.warn(`
      ${this.senderAccount.userName} successfully send the amount of ${amount} to ${account.userName}
    `);
  }
}

class GetSenderAccountDAO implements GetSenderAccount {
  senderAccount: Account = makeAccount();

  async get(): Promise<Account> {
    return this.senderAccount;
  }
}

class GetRecipientAccountDAO implements GetRecipientAccount {
  recipientAccount: Account = makeAccount();

  async get(): Promise<Account> {
    return this.recipientAccount;
  }
}

const TransferMoneyFactory = () => {
  const navigateTo = (screen: string) => {
    console.log(screen);
  };

  const getSenderAccount = new GetSenderAccountDAO();

  const viewModel = useTransferMoney({
    getRecipientAccount: new GetRecipientAccountDAO(),
    getSenderAccount,
    sendMoney: new SendMoneyDAO(getSenderAccount.senderAccount),
    amountToTransfer: 200,
    navigateTo,
  });
  return <TransferMoney {...viewModel} />;
};

export default TransferMoneyFactory;
