import {renderHook, waitFor} from '@testing-library/react-native';
import {Account} from '../../../src/presentation/transferMoney/model';
import {faker} from '@faker-js/faker';
import {Alert} from 'react-native';
import SendMoney from '../../../src/domain/useCases/sendMoney';
import GetSenderAccount from '../../../src/domain/useCases/getSenderAccount';
import GetRecipientAccount from '../../../src/domain/useCases/getRecipientAccount';
import useTransferMoney from '../../../src/presentation/transferMoney/useTransferMoney';
import SendMoneyError from '../../../src/data/errors/sendMoneyError';
import GetRecipientAccountError from '../../../src/data/errors/getRecipientAccountError';
import GetSenderAccountError from '../../../src/data/errors/getSenderAccountError';

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
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
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
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
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
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer: 0,
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
      }),
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetSenderAccountError().message,
        expect.anything(),
      );
    });

    expect(result.current.senderAccount).toEqual({
      agency: '',
      currentAccount: '',
      profilePhoto: '',
      userName: '',
    });
  });

  test('should show alert when call get of GetSenderAccount returning a error different of GetSenderAccountError', async () => {
    jest.spyOn(Alert, 'alert');

    const getSenderAccount = new GetSenderAccountFaker();
    getSenderAccount.completeGetWithError(true);
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: getSenderAccount,
        getRecipientAccount: new GetRecipientAccountFaker(),
        amountToTransfer: 0,
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
      }),
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        'Unexpected error',
        expect.anything(),
      );
    });

    expect(result.current.senderAccount).toEqual({
      agency: '',
      currentAccount: '',
      profilePhoto: '',
      userName: '',
    });
  });

  test('should show alert when call get of GetRecipientAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');

    const getRecipientAccount = new GetRecipientAccountFaker();
    getRecipientAccount.completeGetWithError();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer: 0,
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(new GetSenderAccountFaker().senderAccount),
      }),
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetRecipientAccountError().message,
        expect.anything(),
      );
    });

    expect(result.current.recipientAccount).toEqual({
      agency: '',
      currentAccount: '',
      profilePhoto: '',
      userName: '',
    });
  });

  test('should show alert when call get of GetRecipientAccount returning a error different of GetRecipientAccountError', async () => {
    jest.spyOn(Alert, 'alert');

    const getRecipientAccount = new GetRecipientAccountFaker();
    getRecipientAccount.completeGetWithError(true);
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer: 0,
        navigateTo: () => {},
        sendMoney: new SendMoneySpy(new GetSenderAccountFaker().senderAccount),
      }),
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        'Unexpected error',
        expect.anything(),
      );
    });

    expect(result.current.recipientAccount).toEqual({
      agency: '',
      currentAccount: '',
      profilePhoto: '',
      userName: '',
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
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
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
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
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
        sendMoney: new SendMoneySpy(getSenderAccount.senderAccount),
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
        sendMoney: new SendMoneySpy(new GetSenderAccountFaker().senderAccount),
      }),
    );

    result.current.recipientAccountChange();

    expect(navigateTo).toHaveBeenLastCalledWith('RecipientAccountChange');
  });

  test('should send money to recipient account through of SendMoney when call sendMoney function', async () => {
    const sendMoney = new SendMoneySpy(
      new GetSenderAccountFaker().senderAccount,
    );

    const amountToTransfer = Number(faker.commerce.price());
    const getRecipientAccount = new GetRecipientAccountFaker();
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer,
        navigateTo: () => {},
        sendMoney,
      }),
    );

    const recipientAccount = await getRecipientAccount.get();
    result.current.sendMoney(recipientAccount, amountToTransfer);

    expect(sendMoney.called).toEqual(1);
    expect(sendMoney.calledWith).toEqual({
      account: recipientAccount,
      amount: amountToTransfer,
    });
  });

  test('should show alert when call sendTo of SendMoney returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');

    const getRecipientAccount = new GetRecipientAccountFaker();
    const sendMoney = new SendMoneySpy(
      new GetSenderAccountFaker().senderAccount,
    );
    sendMoney.completeSendToWithError();
    const amountToTransfer = Number(faker.commerce.price());

    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer,
        navigateTo: () => {},
        sendMoney,
      }),
    );

    result.current.sendMoney(
      getRecipientAccount.recipientAccount,
      amountToTransfer,
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new SendMoneyError().message,
        expect.anything(),
      );
    });
  });

  test('should show alert when call sendTo of SendMoney returning error different of SendMoneyError', async () => {
    jest.spyOn(Alert, 'alert');

    const getRecipientAccount = new GetRecipientAccountFaker();
    const sendMoney = new SendMoneySpy(
      new GetSenderAccountFaker().senderAccount,
    );
    sendMoney.completeSendToWithError(true);
    const amountToTransfer = Number(faker.commerce.price());

    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer,
        navigateTo: () => {},
        sendMoney,
      }),
    );

    result.current.sendMoney(
      getRecipientAccount.recipientAccount,
      amountToTransfer,
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        'Unexpected error',
        expect.anything(),
      );
    });
  });

  test('should update isLoading to false when finish call send money', async () => {
    const getRecipientAccount = new GetRecipientAccountFaker();
    const sendMoney = new SendMoneySpy(
      new GetSenderAccountFaker().senderAccount,
    );
    const amountToTransfer = Number(faker.commerce.price());
    const {result} = renderHook(() =>
      useTransferMoney({
        getSenderAccount: new GetSenderAccountFaker(),
        getRecipientAccount,
        amountToTransfer,
        navigateTo: () => {},
        sendMoney,
      }),
    );

    result.current.sendMoney(
      getRecipientAccount.recipientAccount,
      amountToTransfer,
    );

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });
});

class SendMoneySpy implements SendMoney {
  called = 0;
  calledWith: {account: Account; amount: number} = {
    account: {
      userName: '',
      agency: '',
      currentAccount: '',
      profilePhoto: '',
    },
    amount: 0,
  };
  throwError: boolean = false;
  throwOtherError: boolean = false;

  constructor(private readonly senderAccount: Account) {}

  async sendTo(account: Account, amount: number) {
    if (this.throwError) {
      throw new SendMoneyError();
    }
    if (this.throwOtherError) {
      throw {};
    }
    this.called += 1;
    this.calledWith.account = account;
    this.calledWith.amount = amount;
  }

  completeSendToWithError = (differentError = false) => {
    if (differentError) {
      this.throwOtherError = true;
    } else {
      this.throwError = true;
    }
  };
}

class GetSenderAccountFaker implements GetSenderAccount {
  senderAccount: Account = makeAccount();
  throwError: boolean = false;
  throwOtherError: boolean = false;

  async get(): Promise<Account> {
    if (this.throwError) {
      throw new GetSenderAccountError();
    }
    if (this.throwOtherError) {
      throw {};
    }
    return this.senderAccount;
  }

  completeGetWithError = (differentError = false) => {
    if (differentError) {
      this.throwOtherError = true;
    } else {
      this.throwError = true;
    }
  };
}

class GetRecipientAccountFaker implements GetRecipientAccount {
  recipientAccount: Account = makeAccount();
  throwError: boolean = false;
  throwOtherError: boolean = false;

  async get(): Promise<Account> {
    if (this.throwError) {
      throw new GetRecipientAccountError();
    }
    if (this.throwOtherError) {
      throw {};
    }
    return this.recipientAccount;
  }

  completeGetWithError = (differentError = false) => {
    if (differentError) {
      this.throwOtherError = true;
    } else {
      this.throwError = true;
    }
  };
}
