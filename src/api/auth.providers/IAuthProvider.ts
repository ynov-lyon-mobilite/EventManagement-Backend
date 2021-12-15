import { Strategy } from 'passport';

export interface IAuthProvider {
  isAvailable(): boolean;
  strategy(): Strategy | null;
  strategyName(): string;
  scope(): string | string[] | undefined;
}
