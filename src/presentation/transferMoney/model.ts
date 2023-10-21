export type Account = {
  userName: string;
  agency: string;
  currentAccount: string;
  profilePhoto: string;
};

type TransferMoneyViewModel = {
  senderAccount: Account;
  recipientAccount: Account;
  recipientAccountChange: () => void;
  amountToTransfer: string;
  sendMoney: (recipientAccount: Account, amount: number) => void;
  isLoading: boolean;
};

export default TransferMoneyViewModel;
