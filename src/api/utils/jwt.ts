import { JWTPayload } from '@api/schema/types';
import { verify } from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET!;

export const HEADER_KEY = 'jwt-auth';

export const resolverUserToken = (jwt: string): JWTPayload => {
  if (!jwt) throw new Error('No JWT provided');
  if (!jwt.startsWith('Bearer ')) return verify(jwt, JWT_SECRET) as JWTPayload;
  return verify(jwt.slice(7), JWT_SECRET) as JWTPayload;
};
