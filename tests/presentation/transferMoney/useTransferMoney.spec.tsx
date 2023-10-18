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
        amountToTransfer: 0,
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
        amountToTransfer: 0,
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
        amountToTransfer: 0,
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

  test('should show alert when call get of GetRecipientAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');

    const getRecipientAccount = new GetRecipientAccountFaker();
    getRecipientAccount.completeGetWithError();
    renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer: 0,
      }),
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetRecipientAccountError().message,
        expect.anything(),
      );
    });
  });

  test('should update isLoading to false when finish call get sender and recipient accounts', async () => {
    const getSenderAccount = new GetSenderAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer: 0,
      }),
    );

    expect(result.current.isLoading).toEqual(true);

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });

  test('should get amountToTransfer in correct pattern', async () => {
    const amountToTransfer = Number(faker.commerce.price());
    const getSenderAccount = new GetSenderAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer,
      }),
    );

    expect(result.current.amountToTransfer).toEqual(`R$ ${amountToTransfer}`);
  });
});

type TransferMoneyModel = {
  getSenderAccount: GetSenderAccount;
  getRecipientAccount: GetRecipientAccount;
  amountToTransfer: number;
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
  throwError: boolean = false;

  async get(): Promise<Account> {
    if (this.throwError) {
      throw new GetRecipientAccountError();
    }
    return this.recipientAccount;
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

class GetRecipientAccountError extends Error {
  constructor() {
    super();
    this.message = 'Try to get account again.';
    this.name = 'GetRecipientAccountError';
  }
}

const useTransferMoney = ({
  getSenderAccount,
  getRecipientAccount,
  amountToTransfer,
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

  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const response = await getRecipientAccount.get();
      setRecipientAccount(response);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sorry', error.message, [{text: 'ok', onPress: () => {}}]);
      }
    }
  }, [getRecipientAccount]);

  useEffect(() => {
    callGetSenderAndRecipientAccounts();
  }, []);

  const getAmountToTransfer = (): string => {
    return `R$ ${amountToTransfer}`;
  };

  const callGetSenderAndRecipientAccounts = async () => {
    setIsLoading(true);
    await callGetSenderAccount();
    await callGetRecipientAccount();
    setIsLoading(false);
  };

  return {
    amountToTransfer: getAmountToTransfer(),
    isLoading,
    recipientAccount,
    recipientAccountChange: () => {},
    senderAccount,
    sendMoney: () => {},
  };
};
