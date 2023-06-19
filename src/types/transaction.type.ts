import TransactionEnum from "../enums/transaction.enum";

export type Transaction = {
  id: string;
  senderWalletId: string;
  receiverWalletId: string;
  amount: Number;
  transactionType: TransactionEnum;
  transactionTime: Date;
};
