import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {faker} from '@faker-js/faker';

describe('Presentation: TransferMoney', () => {
  test('should show title correctly', () => {
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser=""
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    const title = getByTestId('title_id');

    expect(title.props.children).toEqual('Transfer');
  });

  test('should show bank account information correctly', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={nameFaker}
        agency={agencyFaker}
        currentAccount={currentAccountFaker}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    const nameAccountUser = getByTestId('name_account_user_1_id');
    const agencyLabel = getByTestId('agency_label_1_id');
    const agency = getByTestId('agency_1_id');
    const currentAccountLabel = getByTestId('current_account_label_1_id');
    const currentAccount = getByTestId('current_account_1_id');

    expect(nameAccountUser.props.children).toEqual(nameFaker);
    expect(agencyLabel.props.children).toEqual('Agency');
    expect(agency.props.children).toEqual(agencyFaker);
    expect(currentAccountLabel.props.children).toEqual('Current Account');
    expect(currentAccount.props.children).toEqual(currentAccountFaker);
  });

  test('should show photo profile of account with success', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const photoProfile = faker.image.avatar();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={nameFaker}
        agency={agencyFaker}
        currentAccount={currentAccountFaker}
        photoProfileOfAccount={photoProfile}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    expect(getByTestId('photo_profile_of_account_1_id').props.source).toEqual({
      uri: photoProfile,
    });
  });

  test('should show "to" text correctly', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const photoProfile = faker.image.avatar();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={nameFaker}
        agency={agencyFaker}
        currentAccount={currentAccountFaker}
        photoProfileOfAccount={photoProfile}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    expect(getByTestId('to_id').props.children).toEqual('To');
  });

  test('should show the recipients bank account information correctly', () => {
    const nameFaker = faker.person.firstName();
    const agencyFaker = faker.finance.accountNumber();
    const currentAccountFaker = faker.finance.accountNumber();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={nameFaker}
        recipientAgency={agencyFaker}
        recipientCurrentAccount={currentAccountFaker}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    const nameAccountUser = getByTestId('name_account_user_2_id');
    const agencyLabel = getByTestId('agency_label_2_id');
    const agency = getByTestId('agency_2_id');
    const currentAccountLabel = getByTestId('current_account_label_2_id');
    const currentAccount = getByTestId('current_account_2_id');

    expect(nameAccountUser.props.children).toEqual(nameFaker);
    expect(agencyLabel.props.children).toEqual('Agency');
    expect(agency.props.children).toEqual(agencyFaker);
    expect(currentAccountLabel.props.children).toEqual('Current Account');
    expect(currentAccount.props.children).toEqual(currentAccountFaker);
  });

  test('should show the recipients photo profile of account with success', () => {
    const photoProfile = faker.image.avatar();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={photoProfile}
        recipientAccountChange={function (): {} {
          throw new Error('Function not implemented.');
        }}
        amountToTransfer={''}
      />,
    );

    expect(getByTestId('photo_profile_of_account_2_id').props.source).toEqual({
      uri: photoProfile,
    });
  });

  test('should call recipientAccountChange when press the change button', () => {
    const photoProfile = faker.image.avatar();
    const recipientAccountChange = jest.fn();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={photoProfile}
        recipientAccountChange={recipientAccountChange}
        amountToTransfer={''}
      />,
    );

    fireEvent.press(getByTestId('recipient_account_change_id'));

    expect(recipientAccountChange).toHaveBeenCalled();
  });

  test('should show the change button with correct text', () => {
    const photoProfile = faker.image.avatar();
    const recipientAccountChange = jest.fn();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={photoProfile}
        recipientAccountChange={recipientAccountChange}
        amountToTransfer={''}
      />,
    );

    const changeText = getByTestId('recipient_account_change_text_id');

    expect(changeText.props.children).toEqual('Change');
  });

  test('should show amount to transfer correctly', () => {
    const amountToTransferFake = faker.number.int();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={() => {}}
        amountToTransfer={`R$ ${amountToTransferFake}`}
      />,
    );

    const amountToTransfer = getByTestId('amount_to_transfer_id');

    expect(amountToTransfer.props.children).toEqual(
      `R$ ${amountToTransferFake}`,
    );
  });

  test('should show the amount label to transfer correctly', () => {
    const amountToTransferFake = faker.number.int();
    const {getByTestId} = render(
      <TransferMoney
        nameAccountUser={''}
        agency={''}
        currentAccount={''}
        photoProfileOfAccount={''}
        recipientUserAccountName={''}
        recipientAgency={''}
        recipientCurrentAccount={''}
        profilePhotoOfRecipientsAccount={''}
        recipientAccountChange={() => {}}
        amountToTransfer={`R$ ${amountToTransferFake}`}
      />,
    );

    const amountLabelToTransfer = getByTestId('amount_label_to_transfer_id');

    expect(amountLabelToTransfer.props.children).toEqual(`Amount to transfer`);
  });
});

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
