import {render} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import {faker} from '@faker-js/faker';

describe('Presentation: TransferMoney', () => {
  test('should show title correctly', () => {
    const {getByTestId} = render(
      <TransferMoney nameAccountUser="" agency={''} currentAccount={''} />,
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
});

type Props = {
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
};

const TransferMoney = ({nameAccountUser, agency, currentAccount}: Props) => {
  return (
    <View>
      <Text testID="title_id">Transfer</Text>
      <AccountCard
        nameAccountUser={nameAccountUser}
        agency={agency}
        currentAccount={currentAccount}
      />
    </View>
  );
};

type AccountCardProps = {
  nameAccountUser: string;
  agency: string;
  currentAccount: string;
};

const AccountCard = ({
  nameAccountUser,
  agency,
  currentAccount,
}: AccountCardProps) => (
  <View>
    <Text testID="name_account_user_id">{nameAccountUser}</Text>
    <Text testID="agency_label_id">{'Agency'}</Text>
    <Text testID="agency_id">{agency}</Text>
    <Text testID="current_account_label_id">{'Current Account'}</Text>
    <Text testID="current_account_id">{currentAccount}</Text>
  </View>
);
