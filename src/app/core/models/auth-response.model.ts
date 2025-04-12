export interface IJwtPayload {
  sub: string;
  username: string;
  exp: number;
}

export interface IAuthData {
  accessToken: string;
  tokenType: string;
}

export interface IRawAuthData {
  access_token: string;
  token_type: string;
}
