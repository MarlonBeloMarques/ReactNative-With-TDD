import {render} from '@testing-library/react-native';
import {Text, View} from 'react-native';

describe('Presentation: TransferMoney', () => {
  test('should show title correctly', () => {
    const {getByTestId} = render(<TransferMoney />);

    const title = getByTestId('title_id');

    expect(title.props.children).toEqual('Transfer');
  });
});

const TransferMoney = () => {
  return (
    <View>
      <Text testID="title_id">Transfer</Text>
    </View>
  );
};
