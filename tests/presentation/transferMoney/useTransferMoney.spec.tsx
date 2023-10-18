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
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
      }),
    );

    await waitFor(() => {
      expect(result.current.senderAccount).toEqual(
        getSenderAccount.senderAccount,
      );
    });
  });

  test('should get recipientAccount by GetRecipientAccount when started', async () => {
    const getSenderAccount = new GetSenderAccountFaker();

    const getRecipientAccount = new GetRecipientAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount,
      }),
    );

    await waitFor(() => {
      expect(result.current.recipientAccount).toEqual(
        getRecipientAccount.recipientAccount,
      );
    });
  });

  test('should show alert when call get of GetSenderAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');

    const getSenderAccount = new GetSenderAccountFaker();
    getSenderAccount.completeGetWithError();
    renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
      }),
    );

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
  getRecipientAccount: GetRecipientAccount;
};

interface GetSenderAccount {
  get(): Promise<Account>;
}

interface GetRecipientAccount {
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

class GetRecipientAccountFaker implements GetRecipientAccount {
  recipientAccount: Account = makeAccount();

  async get(): Promise<Account> {
    return this.recipientAccount;
  }
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
  getRecipientAccount,
}: TransferMoneyModel): TransferMoneyViewModel => {
  const [senderAccount, setSenderAccount] = useState<Account>({
    agency: '',
    currentAccount: '',
    profilePhoto: '',
    userName: '',
  });
  const [recipientAccount, setRecipientAccount] = useState<Account>({
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

  const callGetRecipientAccount = useCallback(async () => {
    const response = await getRecipientAccount.get();
    setRecipientAccount(response);
  }, [getRecipientAccount]);

  useEffect(() => {
    callGetSenderAccount();
    callGetRecipientAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    amountToTransfer: '',
    isLoading: false,
    recipientAccount,
    recipientAccountChange: () => {},
    senderAccount,
    sendMoney: () => {},
  };
};
