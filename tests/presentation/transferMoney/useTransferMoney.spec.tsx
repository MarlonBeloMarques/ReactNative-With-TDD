import {renderHook, waitFor} from '@testing-library/react-native';
import TransferMoneyViewModel, {
  Account,
} from '../../../src/presentation/transferMoney/model';
import {faker} from '@faker-js/faker';
import {useCallback, useEffect, useState} from 'react';

const makeAccount = (): Account => {
  return {
    agency: faker.finance.accountNumber(),
    currentAccount: faker.finance.accountNumber(),
    profilePhoto: faker.image.avatar(),
    userName: faker.person.firstName(),
  };
};

describe('Presentation: useTransferMoney', () => {
  test('should get senderAccount by GetSenderAccount when started', async () => {
    const getSenderAccount = new GetSenderAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({getSenderAccount: getSenderAccount}),
    );

    await waitFor(() => {
      expect(result.current.senderAccount).toEqual(
        getSenderAccount.senderAccount,
      );
    });
  });

  test('should get senderAccount by GetSenderAccount when started', async () => {
    const getSenderAccount = new GetSenderAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({getSenderAccount: getSenderAccount}),
    );

    await waitFor(() => {
      expect(result.current.senderAccount).toEqual(
        getSenderAccount.senderAccount,
      );
    });
  });
});

type TransferMoneyModel = {
  getSenderAccount: GetSenderAccount;
};

interface GetSenderAccount {
  get(): Promise<Account>;
}

class GetSenderAccountFaker implements GetSenderAccount {
  senderAccount: Account = makeAccount();

  async get(): Promise<Account> {
    return this.senderAccount;
  }
}

const useTransferMoney = ({
  getSenderAccount,
}: TransferMoneyModel): TransferMoneyViewModel => {
  const [senderAccount, setSenderAccount] = useState<Account>({
    agency: '',
    currentAccount: '',
    profilePhoto: '',
    userName: '',
  });

  const callGetSenderAccount = useCallback(async () => {
    const response = await getSenderAccount.get();
    setSenderAccount(response);
  }, [getSenderAccount]);

  useEffect(() => {
    callGetSenderAccount();
  }, [callGetSenderAccount]);

  return {
    amountToTransfer: '',
    isLoading: false,
    recipientAccount: {
      agency: '',
      currentAccount: '',
      profilePhoto: '',
      userName: '',
    },
    recipientAccountChange: () => {},
    senderAccount,
    sendMoney: () => {},
  };
};
