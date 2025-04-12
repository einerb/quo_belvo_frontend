export interface ILinkBankData {
  institution: string;
  credentials: {
    username: string;
    password: string;
    token?: string;
  };
}
