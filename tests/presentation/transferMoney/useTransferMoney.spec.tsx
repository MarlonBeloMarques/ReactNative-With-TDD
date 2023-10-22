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

const emptyAccount = {
  agency: '',
  currentAccount: '',
  profilePhoto: '',
  userName: '',
};

describe('Presentation: useTransferMoney', () => {
  test('should get senderAccount by GetSenderAccount when started', async () => {
    const {
      sut: {result},
      getSenderAccount,
    } = makeSut(0);

    await waitFor(() => {
      expect(result.current.senderAccount).toEqual(
        getSenderAccount.senderAccount,
      );
    });
  });

  test('should get recipientAccount by GetRecipientAccount when started', async () => {
    const {
      sut: {result},
      getRecipientAccount,
    } = makeSut(0);

    await waitFor(() => {
      expect(result.current.recipientAccount).toEqual(
        getRecipientAccount.recipientAccount,
      );
    });
  });

  test('should show alert when call get of GetSenderAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');
    const {
      sut: {result},
    } = makeSut(0, () => {}, {
      completeWithError: true,
      isDifferentError: false,
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetSenderAccountError().message,
        expect.anything(),
      );
    });

    expect(result.current.senderAccount).toEqual(emptyAccount);
  });

  test('should show alert when call get of GetSenderAccount returning a error different of GetSenderAccountError', async () => {
    jest.spyOn(Alert, 'alert');
    const {
      sut: {result},
    } = makeSut(0, () => {}, {completeWithError: true, isDifferentError: true});

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        'Unexpected error',
        expect.anything(),
      );
    });

    expect(result.current.senderAccount).toEqual(emptyAccount);
  });

  test('should show alert when call get of GetRecipientAccount returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');
    const {
      sut: {result},
      getRecipientAccount,
    } = makeSut(0);
    getRecipientAccount.completeGetWithError();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        new GetRecipientAccountError().message,
        expect.anything(),
      );
    });

    expect(result.current.recipientAccount).toEqual(emptyAccount);
  });

  test('should show alert when call get of GetRecipientAccount returning a error different of GetRecipientAccountError', async () => {
    jest.spyOn(Alert, 'alert');
    const {
      sut: {result},
      getRecipientAccount,
    } = makeSut(0);
    getRecipientAccount.completeGetWithError(true);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sorry',
        'Unexpected error',
        expect.anything(),
      );
    });

    expect(result.current.recipientAccount).toEqual(emptyAccount);
  });

  test('should update isLoading to false when finish call get sender and recipient accounts', async () => {
    const {
      sut: {result},
    } = makeSut(0);
    expect(result.current.isLoading).toEqual(true);

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });

  test('should get amountToTransfer in correct pattern', async () => {
    const amountToTransfer = Number(faker.commerce.price());
    const {
      sut: {result},
    } = makeSut(amountToTransfer);

    expect(result.current.amountToTransfer).toEqual(`R$ ${amountToTransfer}`);

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });

  test('should get amountToTransfer in correct pattern when undefined', async () => {
    const amountToTransfer = undefined as unknown as number;
    const {
      sut: {result},
    } = makeSut(amountToTransfer);

    expect(result.current.amountToTransfer).toEqual(`R$ 0`);

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });

  test('should call navigateTo function with correct param when call recipientAccountChange', async () => {
    const navigateTo = jest.fn();
    const {
      sut: {result},
    } = makeSut(0, navigateTo);

    result.current.recipientAccountChange();

    expect(navigateTo).toHaveBeenLastCalledWith('RecipientAccountChange');

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });

  test('should send money to recipient account through of SendMoney when call sendMoney function', async () => {
    const amountToTransfer = Number(faker.commerce.price());
    const {
      sut: {result},
      getRecipientAccount,
      sendMoney,
    } = makeSut(amountToTransfer);

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });

    const recipientAccount = await getRecipientAccount.get();

    await waitFor(() => {
      result.current.sendMoney(recipientAccount, amountToTransfer);
      expect(result.current.isLoading).toEqual(false);
    });

    expect(sendMoney.called).toEqual(1);
    expect(sendMoney.calledWith).toEqual({
      account: recipientAccount,
      amount: amountToTransfer,
    });
  });

  test('should show alert when call sendTo of SendMoney returning a error exception', async () => {
    jest.spyOn(Alert, 'alert');
    const amountToTransfer = Number(faker.commerce.price());

    const {
      sut: {result},
      sendMoney,
      getRecipientAccount,
    } = makeSut(amountToTransfer);
    sendMoney.completeSendToWithError();

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
    const amountToTransfer = Number(faker.commerce.price());

    const {
      sut: {result},
      getRecipientAccount,
      sendMoney,
    } = makeSut(amountToTransfer);
    sendMoney.completeSendToWithError(true);

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
    const amountToTransfer = Number(faker.commerce.price());
    const {
      sut: {result},
      getRecipientAccount,
    } = makeSut(amountToTransfer);

    result.current.sendMoney(
      getRecipientAccount.recipientAccount,
      amountToTransfer,
    );

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });
});

const makeSut = (
  amountToTransfer: number,
  navigateTo = () => {},
  getSenderAccountError = {
    completeWithError: false,
    isDifferentError: false,
  },
) => {
  const getRecipientAccount = new GetRecipientAccountFaker();
  const getSenderAccount = new GetSenderAccountFaker();

  if (getSenderAccountError.completeWithError) {
    getSenderAccount.completeGetWithError(
      getSenderAccountError.isDifferentError,
    );
  }

  const sendMoney = new SendMoneySpy(new GetSenderAccountFaker().senderAccount);

  const sut = renderHook(() =>
    useTransferMoney({
      getSenderAccount,
      getRecipientAccount,
      amountToTransfer,
      navigateTo,
      sendMoney,
    }),
  );

  return {sut, getRecipientAccount, getSenderAccount, sendMoney};
};

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
