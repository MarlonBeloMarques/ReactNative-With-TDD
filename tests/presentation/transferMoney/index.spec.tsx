import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {faker} from '@faker-js/faker';

describe('Presentation: TransferMoney', () => {
  test('should show title correctly', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    const title = getByTestId('title_id');

    expect(title.props.children).toEqual('Transfer');
  });

  test('should show bank account information correctly', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: agencyFaker,
      currentAccount: currentAccountFaker,
      nameAccountUser: nameFaker,
    });

    expect(getByTestId('name_account_user_1_id').props.children).toEqual(
      nameFaker,
    );
    expect(getByTestId('agency_label_1_id').props.children).toEqual('Agency');
    expect(getByTestId('agency_1_id').props.children).toEqual(agencyFaker);
    expect(getByTestId('current_account_label_1_id').props.children).toEqual(
      'Current Account',
    );
    expect(getByTestId('current_account_1_id').props.children).toEqual(
      currentAccountFaker,
    );
  });

  test('should show photo profile of account with success', () => {
    const photoProfile = faker.image.avatar();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: photoProfile,
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    expect(getByTestId('photo_profile_of_account_1_id').props.source).toEqual({
      uri: photoProfile,
    });
  });

  test('should show "to" text correctly', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    expect(getByTestId('to_id').props.children).toEqual('To');
  });

  test('should show the recipients bank account information correctly', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: agencyFaker,
      recipientCurrentAccount: currentAccountFaker,
      recipientUserAccountName: nameFaker,
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    expect(getByTestId('name_account_user_2_id').props.children).toEqual(
      nameFaker,
    );
    expect(getByTestId('agency_label_2_id').props.children).toEqual('Agency');
    expect(getByTestId('agency_2_id').props.children).toEqual(agencyFaker);
    expect(getByTestId('current_account_label_2_id').props.children).toEqual(
      'Current Account',
    );
    expect(getByTestId('current_account_2_id').props.children).toEqual(
      currentAccountFaker,
    );
  });

  test('should show the recipients photo profile of account with success', () => {
    const photoProfile = faker.image.avatar();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: photoProfile,
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    expect(getByTestId('photo_profile_of_account_2_id').props.source).toEqual({
      uri: photoProfile,
    });
  });

  test('should call recipientAccountChange when press the change button', () => {
    const recipientAccountChange = jest.fn();
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange,
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    fireEvent.press(getByTestId('recipient_account_change_id'));

    expect(recipientAccountChange).toHaveBeenCalled();
  });

  test('should show the change button with correct text', () => {
    const {getByTestId} = makeSut({
      sendMoney: () => {},
      amountToTransfer: ``,
      recipientAccountChange: () => {},
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
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
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
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
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
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
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
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
      profilePhotoOfRecipientsAccount: '',
      recipientAgency: '',
      recipientCurrentAccount: '',
      recipientUserAccountName: '',
      photoProfileOfAccount: '',
      agency: '',
      currentAccount: '',
      nameAccountUser: '',
    });

    const sendMoneyText = getByTestId('send_money_text_id');

    expect(sendMoneyText.props.children).toEqual('Send money');
  });
});

type SutProps = {
  sendMoney: () => void;
  amountToTransfer: string;
  recipientAccountChange: () => void;
  profilePhotoOfRecipientsAccount: string;
  recipientCurrentAccount: string;
  recipientAgency: string;
  recipientUserAccountName: string;
  photoProfileOfAccount: string;
  currentAccount: string;
  agency: string;
  nameAccountUser: string;
};

const makeSut = ({
  sendMoney,
  amountToTransfer,
  recipientAccountChange,
  profilePhotoOfRecipientsAccount,
  recipientAgency,
  recipientCurrentAccount,
  recipientUserAccountName,
  photoProfileOfAccount,
  agency,
  currentAccount,
  nameAccountUser,
}: SutProps) => {
  const sut = render(
    <TransferMoney
      nameAccountUser={nameAccountUser}
      agency={agency}
      currentAccount={currentAccount}
      photoProfileOfAccount={photoProfileOfAccount}
      recipientUserAccountName={recipientUserAccountName}
      recipientAgency={recipientAgency}
      recipientCurrentAccount={recipientCurrentAccount}
      profilePhotoOfRecipientsAccount={profilePhotoOfRecipientsAccount}
      recipientAccountChange={recipientAccountChange}
      amountToTransfer={amountToTransfer}
      sendMoney={sendMoney}
    />,
  );

  return sut;
};

type Props = {
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
  photoProfileOfAccount: string;
  recipientUserAccountName: string;
  recipientAgency: string;
  recipientCurrentAccount: string;
  profilePhotoOfRecipientsAccount: string;
  recipientAccountChange: () => void;
  amountToTransfer: string;
  sendMoney: () => void;
};

const TransferMoney = ({
  nameAccountUser,
  agency,
  currentAccount,
  photoProfileOfAccount,
  recipientAgency,
  recipientCurrentAccount,
  recipientUserAccountName,
  profilePhotoOfRecipientsAccount,
  recipientAccountChange,
  amountToTransfer,
  sendMoney,
}: Props) => {
  return (
    <View>
      <Text testID="title_id">Transfer</Text>
      <AccountCard
        id="1"
        nameAccountUser={nameAccountUser}
        agency={agency}
        currentAccount={currentAccount}
        photoProfileOfAccount={photoProfileOfAccount}
      />
      <Text testID="to_id">To</Text>
      <AccountCard
        id="2"
        nameAccountUser={recipientUserAccountName}
        agency={recipientAgency}
        currentAccount={recipientCurrentAccount}
        photoProfileOfAccount={profilePhotoOfRecipientsAccount}
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
