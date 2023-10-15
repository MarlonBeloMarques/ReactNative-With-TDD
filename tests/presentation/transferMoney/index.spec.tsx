import {render} from '@testing-library/react-native';
import {Image, Text, View} from 'react-native';
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
      />,
    );

    expect(getByTestId('photo_profile_of_account_2_id').props.source).toEqual({
      uri: photoProfile,
    });
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
      />
    </View>
  );
};

type AccountCardProps = {
  id: string;
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
  photoProfileOfAccount: string;
};

const AccountCard = ({
  id,
  nameAccountUser,
  agency,
  currentAccount,
  photoProfileOfAccount,
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
  </View>
);
