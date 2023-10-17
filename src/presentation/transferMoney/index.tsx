import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TransferMoneyViewModel from './model';

const TransferMoney = ({
  senderAccount,
  recipientAccount,
  recipientAccountChange,
  amountToTransfer,
  sendMoney,
  isLoading,
}: TransferMoneyViewModel) => {
  return (
    <View>
      {isLoading && <ActivityIndicator testID="loading_animation_id" />}
      {!isLoading && (
        <View testID="content_id">
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
          <Text testID="amount_label_to_transfer_id">
            {'Amount to transfer'}
          </Text>
          <TouchableOpacity
            testID="send_money_id"
            onPress={() => sendMoney(recipientAccount)}>
            <Text testID="send_money_text_id">{'Send money'}</Text>
          </TouchableOpacity>
        </View>
      )}
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

export default TransferMoney;
