import { Strategy } from 'passport';
import { Express } from 'express';

export interface IAuthProvider {
  isAvailable(): boolean;
  strategy(): Strategy | null;
  callback(app: Express): void;
}
