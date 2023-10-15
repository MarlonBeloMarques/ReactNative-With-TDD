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
      />,
    );

    const nameAccountUser = getByTestId('name_account_user_id');
    const agencyLabel = getByTestId('agency_label_id');
    const agency = getByTestId('agency_id');
    const currentAccountLabel = getByTestId('current_account_label_id');
    const currentAccount = getByTestId('current_account_id');

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
      />,
    );

    expect(getByTestId('photo_profile_of_account_id').props.source).toEqual({
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
      />,
    );

    expect(getByTestId('to_id').props.children).toEqual('To');
  });
});

type Props = {
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
  photoProfileOfAccount: string;
};

const TransferMoney = ({
  nameAccountUser,
  agency,
  currentAccount,
  photoProfileOfAccount,
}: Props) => {
  return (
    <View>
      <Text testID="title_id">Transfer</Text>
      <AccountCard
        nameAccountUser={nameAccountUser}
        agency={agency}
        currentAccount={currentAccount}
        photoProfileOfAccount={photoProfileOfAccount}
      />
      <Text testID="to_id">To</Text>
    </View>
  );
};

type AccountCardProps = {
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
  photoProfileOfAccount: string;
};

const AccountCard = ({
  nameAccountUser,
  agency,
  currentAccount,
  photoProfileOfAccount,
}: AccountCardProps) => (
  <View>
    <Image
      testID="photo_profile_of_account_id"
      source={{uri: photoProfileOfAccount}}
    />
    <Text testID="name_account_user_id">{nameAccountUser}</Text>
    <Text testID="agency_label_id">{'Agency'}</Text>
    <Text testID="agency_id">{agency}</Text>
    <Text testID="current_account_label_id">{'Current Account'}</Text>
    <Text testID="current_account_id">{currentAccount}</Text>
  </View>
);
