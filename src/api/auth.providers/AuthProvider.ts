import { Strategy } from 'passport';

export interface IAuthProvider {
  strategy(): Strategy;
  authUrl(): void;
  callback(app: Express.Application): void;
}
