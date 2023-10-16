import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {faker} from '@faker-js/faker';

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
    });

    const amountLabelToTransfer = getByTestId('amount_label_to_transfer_id');

    expect(amountLabelToTransfer.props.children).toEqual(`Amount to transfer`);
  });

  test('should call sendMoney function when press the send money button', () => {
    const sendMoney = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney,
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
    });

    fireEvent.press(getByTestId('send_money_id'));

    expect(sendMoney).toHaveBeenCalled();
  });

  test('should show send money button with correct text', () => {
    const sendMoney = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney,
      amountToTransfer: '',
      recipientAccountChange: () => {},
      recipientAccount: makeAccount(),
      senderAccount: makeAccount(),
    });

    const sendMoneyText = getByTestId('send_money_text_id');

    expect(sendMoneyText.props.children).toEqual('Send money');
  });
});

type SutProps = {
  sendMoney: () => void;
  amountToTransfer: string;
  recipientAccountChange: () => void;
  recipientAccount: Account;
  senderAccount: Account;
};

const makeSut = ({
  sendMoney,
  amountToTransfer,
  recipientAccountChange,
  recipientAccount,
  senderAccount,
}: SutProps) => {
  const sut = render(
    <TransferMoney
      senderAccount={senderAccount}
      recipientAccount={recipientAccount}
      recipientAccountChange={recipientAccountChange}
      amountToTransfer={amountToTransfer}
      sendMoney={sendMoney}
    />,
  );

  return sut;
};

type Props = {
  senderAccount: Account;
  recipientAccount: Account;
  recipientAccountChange: () => void;
  amountToTransfer: string;
  sendMoney: () => void;
};

type Account = {
  userName: string;
  agency: string;
  currentAccount: string;
  profilePhoto: string;
};

const TransferMoney = ({
  senderAccount,
  recipientAccount,
  recipientAccountChange,
  amountToTransfer,
  sendMoney,
}: Props) => {
  return (
    <View>
      <Text testID="title_id">Transfer</Text>
      <AccountCard
        id="1"
        nameAccountUser={senderAccount.userName}
        agency={senderAccount.agency}
        currentAccount={senderAccount.currentAccount}
        photoProfileOfAccount={senderAccount.profilePhoto}
      />
      <Text testID="to_id">To</Text>
      <AccountCard
        id="2"
        nameAccountUser={recipientAccount.userName}
        agency={recipientAccount.agency}
        currentAccount={recipientAccount.currentAccount}
        photoProfileOfAccount={recipientAccount.profilePhoto}
        recipientAccountChange={recipientAccountChange}
      />
      <Text testID="amount_to_transfer_id">{amountToTransfer}</Text>
      <Text testID="amount_label_to_transfer_id">{'Amount to transfer'}</Text>
      <TouchableOpacity testID="send_money_id" onPress={sendMoney}>
        <Text testID="send_money_text_id">{'Send money'}</Text>
      </TouchableOpacity>
    </View>
  );
};

type AccountCardProps = {
  id: string;
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
  photoProfileOfAccount: string;
  recipientAccountChange?: () => void;
};

const AccountCard = ({
  id,
  nameAccountUser,
  agency,
  currentAccount,
  photoProfileOfAccount,
  recipientAccountChange,
}: AccountCardProps) => (
  <View>
    <Image
      testID={`photo_profile_of_account_${id}_id`}
      source={{uri: photoProfileOfAccount}}
    />
    <Text testID={`name_account_user_${id}_id`}>{nameAccountUser}</Text>
    <Text testID={`agency_label_${id}_id`}>{'Agency'}</Text>
    <Text testID={`agency_${id}_id`}>{agency}</Text>
    <Text testID={`current_account_label_${id}_id`}>{'Current Account'}</Text>
    <Text testID={`current_account_${id}_id`}>{currentAccount}</Text>
    {id === '2' && (
      <TouchableOpacity
        testID="recipient_account_change_id"
        onPress={recipientAccountChange}>
        <Text testID="recipient_account_change_text_id">{'Change'}</Text>
      </TouchableOpacity>
    )}
  </View>
);
