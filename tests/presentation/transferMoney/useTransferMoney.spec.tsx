import {renderHook, waitFor} from '@testing-library/react-native';
import TransferMoneyViewModel, {
  Account,
} from '../../../src/presentation/transferMoney/model';
import {faker} from '@faker-js/faker';
import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';

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

  test('should show alert when call get of GetSenderAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');

    const getSenderAccount = new GetSenderAccountFaker();
    getSenderAccount.completeGetWithError();
    renderHook(() => useTransferMoney({getSenderAccount: getSenderAccount}));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetSenderAccountError().message,
        expect.anything(),
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
  throwError: boolean = false;

  async get(): Promise<Account> {
    if (this.throwError) {
      throw new GetSenderAccountError();
    }
    return this.senderAccount;
  }

  completeGetWithError = () => {
    this.throwError = true;
  };
}

class GetSenderAccountError extends Error {
  constructor() {
    super();
    this.message = 'Try to get account again.';
    this.name = 'GetSenderAccountError';
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
    try {
      const response = await getSenderAccount.get();
      setSenderAccount(response);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sorry', error.message, [{text: 'ok', onPress: () => {}}]);
      }
    }
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
