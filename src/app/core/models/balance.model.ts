import { ITransaction } from "./transaction.model";

export interface IBalance {
  balance: number;
  income: number;
  expenses: number;
  transactions: ITransaction[];
  currency: string;
}
