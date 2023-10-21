import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import TransferMoneyViewModel, {Account} from './model';
import GetSenderAccount from '../../domain/useCases/getSenderAccount';
import GetRecipientAccount from '../../domain/useCases/getRecipientAccount';
import SendMoney from '../../domain/useCases/sendMoney';

type TransferMoneyModel = {
  getSenderAccount: GetSenderAccount;
  getRecipientAccount: GetRecipientAccount;
  amountToTransfer: number;
  navigateTo: (screen: string) => void;
  sendMoney: SendMoney;
};

const useTransferMoney = ({
  getSenderAccount,
  getRecipientAccount,
  amountToTransfer,
  navigateTo,
  sendMoney,
}: TransferMoneyModel): TransferMoneyViewModel => {
  const [senderAccount, setSenderAccount] = useState<Account>({
    agency: '',
    currentAccount: '',
    profilePhoto: '',
    userName: '',
  });
  const [recipientAccount, setRecipientAccount] = useState<Account>({
    agency: '',
    currentAccount: '',
    profilePhoto: '',
    userName: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  const callGetSenderAccount = useCallback(async () => {
    try {
      const response = await getSenderAccount.get();
      setSenderAccount(response);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sorry', error.message, [{text: 'ok', onPress: () => {}}]);
      }
    }
  }, [getSenderAccount]);

  const callGetRecipientAccount = useCallback(async () => {
    try {
      const response = await getRecipientAccount.get();
      setRecipientAccount(response);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sorry', error.message, [{text: 'ok', onPress: () => {}}]);
      }
    }
  }, [getRecipientAccount]);

  useEffect(() => {
    callGetSenderAndRecipientAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAmountToTransfer = (): string => {
    return `R$ ${amountToTransfer || 0}`;
  };

  const callGetSenderAndRecipientAccounts = async () => {
    setIsLoading(true);
    await callGetSenderAccount();
    await callGetRecipientAccount();
    setIsLoading(false);
  };

  const recipientAccountChange = () => {
    navigateTo('RecipientAccountChange');
  };

  const sendMoneyTo = async (recipientAccount: Account, amount: number) => {
    setIsLoading(true);
    try {
      await sendMoney.sendTo(recipientAccount, amount);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sorry', error.message, [{text: 'ok', onPress: () => {}}]);
      }
    }

    setIsLoading(false);
  };

  return {
    amountToTransfer: getAmountToTransfer(),
    isLoading,
    recipientAccount,
    recipientAccountChange,
    senderAccount,
    sendMoney: sendMoneyTo,
  };
};

export default useTransferMoney;
