import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {faker} from '@faker-js/faker';
import TransferMoney from '../../../src/presentation/transferMoney';
import {Account} from '../../../src/presentation/transferMoney/model';

const makeAccount = (): Account => {
  return {
    agency: faker.finance.accountNumber(),
    currentAccount: faker.finance.accountNumber(),
    profilePhoto: faker.image.avatar(),
    userName: faker.person.firstName(),
  };
};

describe('Presentation: TransferMoney', () => {
  test('should show title correctly', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    const title = getByTestId('title_id');

    expect(title.props.children).toEqual('Transfer');
  });

  test('should show bank account information correctly', () => {
    const senderAccount = makeAccount();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount,
      isLoading: false,
    });

    expect(getByTestId('name_account_user_1_id').props.children).toEqual(
      senderAccount.userName,
    );
    expect(getByTestId('agency_label_1_id').props.children).toEqual('Agency');
    expect(getByTestId('agency_1_id').props.children).toEqual(
      senderAccount.agency,
    );
    expect(getByTestId('current_account_label_1_id').props.children).toEqual(
      'Current Account',
    );
    expect(getByTestId('current_account_1_id').props.children).toEqual(
      senderAccount.currentAccount,
    );
  });

  test('should show photo profile of account with success', () => {
    const senderAccount = makeAccount();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount,
      isLoading: false,
    });

    expect(getByTestId('photo_profile_of_account_1_id').props.source).toEqual({
      uri: senderAccount.profilePhoto,
    });
  });

  test('should show "to" text correctly', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    expect(getByTestId('to_id').props.children).toEqual('To');
  });

  test('should show the recipients bank account information correctly', () => {
    const recipientAccount = makeAccount();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount,
      senderAccount: makeAccount(),
      isLoading: false,
    });

    expect(getByTestId('name_account_user_2_id').props.children).toEqual(
      recipientAccount.userName,
    );
    expect(getByTestId('agency_label_2_id').props.children).toEqual('Agency');
    expect(getByTestId('agency_2_id').props.children).toEqual(
      recipientAccount.agency,
    );
    expect(getByTestId('current_account_label_2_id').props.children).toEqual(
      'Current Account',
    );
    expect(getByTestId('current_account_2_id').props.children).toEqual(
      recipientAccount.currentAccount,
    );
  });

  test('should show the recipients photo profile of account with success', () => {
    const recipientAccount = makeAccount();

    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount,
      senderAccount: makeAccount(),
      isLoading: false,
    });

    expect(getByTestId('photo_profile_of_account_2_id').props.source).toEqual({
      uri: recipientAccount.profilePhoto,
    });
  });

  test('should call recipientAccountChange when press the change button', () => {
    const recipientAccountChange = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange,
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    fireEvent.press(getByTestId('recipient_account_change_id'));

    expect(recipientAccountChange).toHaveBeenCalled();
  });

  test('should show the change button with correct text', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    const changeText = getByTestId('recipient_account_change_text_id');

    expect(changeText.props.children).toEqual('Change');
  });

  test('should show amount to transfer correctly', () => {
    const amountToTransferFake = faker.number.int();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: `R$ ${amountToTransferFake}`,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    const amountToTransfer = getByTestId('amount_to_transfer_id');

    expect(amountToTransfer.props.children).toEqual(
      `R$ ${amountToTransferFake}`,
    );
  });

  test('should show the amount label to transfer correctly', () => {
    const amountToTransferFake = faker.number.int();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: `R$ ${amountToTransferFake}`,
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    const amountLabelToTransfer = getByTestId('amount_label_to_transfer_id');

    expect(amountLabelToTransfer.props.children).toEqual(`Amount to transfer`);
  });

  test('should call sendMoney function correctly when press the send money button', () => {
    const recipientAccount = makeAccount();
    const sendMoney = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney,
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount,
      senderAccount: makeAccount(),
      isLoading: false,
    });

    fireEvent.press(getByTestId('send_money_id'));

    expect(sendMoney).toHaveBeenCalledWith(recipientAccount);
  });

  test('should show send money button with correct text', () => {
    const sendMoney = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney,
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading: false,
    });

    const sendMoneyText = getByTestId('send_money_text_id');

    expect(sendMoneyText.props.children).toEqual('Send money');
  });

  test('should show loading animation when isLoading is true', () => {
    const isLoading = true;
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading,
    });

    const loadingAnimation = getByTestId('loading_animation_id');

    expect(loadingAnimation).toBeTruthy();
  });

  test('should not show loading animation when isLoading is false', () => {
    const isLoading = false;
    const {queryByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading,
    });

    const loadingAnimation = queryByTestId('loading_animation_id');

    expect(loadingAnimation).not.toBeTruthy();
  });

  test('should not show the content of screen if isLoading is true', () => {
    const isLoading = true;
    const {queryByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading,
    });

    const content = queryByTestId('content_id');

    expect(content).not.toBeTruthy();
  });

  test('should show the content of screen if isLoading is false', () => {
    const isLoading = false;
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
      isLoading,
    });

    const content = getByTestId('content_id');

    expect(content).toBeTruthy();
  });
});

type SutProps = {
  sendMoney: () => void;
  amountToTransfer: string;
  recipientAccountChange: () => void;
  recipientAccount: Account;
  senderAccount: Account;
  isLoading: boolean;
};

const makeSut = ({
  sendMoney,
  amountToTransfer,
  recipientAccountChange,
  recipientAccount,
  senderAccount,
  isLoading,
}: SutProps) => {
  const sut = render(
    <TransferMoney
      senderAccount={senderAccount}
      recipientAccount={recipientAccount}
      recipientAccountChange={recipientAccountChange}
      amountToTransfer={amountToTransfer}
      sendMoney={sendMoney}
      isLoading={isLoading}
    />,
  );

  return sut;
};
