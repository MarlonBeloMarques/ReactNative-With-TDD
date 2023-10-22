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
    <View style={{flex: 1}}>
      {isLoading && (
        <ActivityIndicator
          size={'large'}
          testID="loading_animation_id"
          style={{flex: 1}}
        />
      )}
      {!isLoading && (
        <View style={{flex: 1}} testID="content_id">
          <View style={{alignItems: 'center', marginBottom: 48}}>
            <Text
              style={{fontSize: 26, color: '#1E1E1E', fontWeight: 'bold'}}
              testID="title_id">
              Transfer
            </Text>
          </View>
          <AccountCard
            id="1"
            nameAccountUser={senderAccount.userName}
            agency={senderAccount.agency}
            currentAccount={senderAccount.currentAccount}
            photoProfileOfAccount={senderAccount.profilePhoto}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              paddingVertical: 19,
              paddingLeft: 15,
            }}
            testID="to_id">
            To
          </Text>
          <AccountCard
            id="2"
            nameAccountUser={recipientAccount.userName}
            agency={recipientAccount.agency}
            currentAccount={recipientAccount.currentAccount}
            photoProfileOfAccount={recipientAccount.profilePhoto}
            recipientAccountChange={recipientAccountChange}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
            <Text
              style={{fontSize: 28, fontWeight: '800'}}
              testID="amount_to_transfer_id">
              {amountToTransfer}
            </Text>
            <Text
              style={{fontSize: 12, fontWeight: 'bold', color: '#CACACA'}}
              testID="amount_label_to_transfer_id">
              {'Amount to transfer'}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: 68,
                backgroundColor: '#FFD460',
                width: '100%',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              testID="send_money_id"
              onPress={() =>
                sendMoney(recipientAccount, Number(amountToTransfer))
              }>
              <Text
                style={{fontSize: 18, fontWeight: 'bold'}}
                testID="send_money_text_id">
                {'Send money'}
              </Text>
            </TouchableOpacity>
          </View>
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
  <View
    style={{
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
    }}>
    <Image
      testID={`photo_profile_of_account_${id}_id`}
      source={{uri: photoProfileOfAccount}}
      style={{width: 55, height: 55, borderRadius: 30, marginRight: 14}}
    />
    <View style={{flexDirection: 'column'}}>
      <Text
        style={{fontSize: 10, fontWeight: 'bold', marginBottom: 6}}
        testID={`name_account_user_${id}_id`}>
        {nameAccountUser}
      </Text>
      <Text
        style={{fontSize: 6, fontWeight: 'bold', color: '#CACACA'}}
        testID={`agency_label_${id}_id`}>
        {'Agency'}
      </Text>
      <Text
        style={{fontSize: 8, fontWeight: 'bold'}}
        testID={`agency_${id}_id`}>
        {agency}
      </Text>
      <Text
        style={{fontSize: 6, fontWeight: 'bold', color: '#CACACA'}}
        testID={`current_account_label_${id}_id`}>
        {'Current Account'}
      </Text>
      <Text
        style={{fontSize: 8, fontWeight: 'bold'}}
        testID={`current_account_${id}_id`}>
        {currentAccount}
      </Text>
    </View>
    {id === '2' && (
      <View style={{alignItems: 'flex-end', flex: 1}}>
        <TouchableOpacity
          style={{}}
          testID="recipient_account_change_id"
          onPress={recipientAccountChange}>
          <Text
            style={{fontSize: 16, fontWeight: 'bold', color: '#E6B31E'}}
            testID="recipient_account_change_text_id">
            {'Change'}
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default TransferMoney;
