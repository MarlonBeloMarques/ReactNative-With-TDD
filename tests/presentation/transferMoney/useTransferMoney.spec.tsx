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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
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
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
      }),
    );

    expect(result.current.amountToTransfer).toEqual(`R$ ${amountToTransfer}`);
  });

  test('should get amountToTransfer in correct pattern when undefined', async () => {
    const amountToTransfer = undefined as unknown as number;
    const getSenderAccount = new GetSenderAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer,
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(),
      }),
    );

    expect(result.current.amountToTransfer).toEqual(`R$ 0`);
  });

  test('should call navigateTo function with correct param when call recipientAccountChange', async () => {
    const navigateTo = jest.fn();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer: 0,
        navigateTo,
        sendMoney: new SendMoneySpy(),
      }),
    );

    result.current.recipientAccountChange();

    expect(navigateTo).toHaveBeenLastCalledWith('RecipientAccountChange');
  });

  test('should send money to recipient account through of SendMoney when call sendMoney function', async () => {
    const sendMoney = new SendMoneySpy();
    const getRecipientAccount = new GetRecipientAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer: 0,
        navigateTo: () => {},
        sendMoney,
      }),
    );

    const recipientAccount = await getRecipientAccount.get();
    result.current.sendMoney(recipientAccount);

    expect(sendMoney.called).toEqual(1);
    expect(sendMoney.calledWith).toEqual(recipientAccount);
  });
});

type TransferMoneyModel = {
  getSenderAccount: GetSenderAccount;
  getRecipientAccount: GetRecipientAccount;
  amountToTransfer: number;
  navigateTo: (screen: string) => void;
  sendMoney: SendMoney;
};

interface GetSenderAccount {
  get(): Promise<Account>;
}

interface GetRecipientAccount {
  get(): Promise<Account>;
}

interface SendMoney {
  sendTo(account: Account): Promise<void>;
}

class SendMoneySpy implements SendMoney {
  called = 0;
  calledWith: Account = {
    userName: '',
    agency: '',
    currentAccount: '',
    profilePhoto: '',
  };

  async sendTo(account: Account) {
    this.called += 1;
    this.calledWith = account;
  }
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
  navigateTo,
  sendMoney,
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
    return `R$ ${amountToTransfer || 0}`;
  };

  const callGetSenderAndRecipientAccounts = async () => {
    setIsLoading(true);
    await callGetSenderAccount();
    await callGetRecipientAccount();
    setIsLoading(false);
  };

  const recipientAccountChange = () => {
    navigateTo('RecipientAccountChange');
  };

  const sendMoneyTo = async (recipientAccount: Account) => {
    await sendMoney.sendTo(recipientAccount);
  };

  return {
    amountToTransfer: getAmountToTransfer(),
    isLoading,
    recipientAccount,
    recipientAccountChange,
    senderAccount,
    sendMoney: sendMoneyTo,
  };
};
