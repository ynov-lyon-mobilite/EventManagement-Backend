import { CommonContext, JWTPayload } from '@api/schema/types';
import { verify } from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET!;

export const HEADER_KEY = 'jwt-auth';

export const resolverUserToken = (
  jwt: string | undefined
): CommonContext['user'] => {
  if (!jwt) return undefined;
  if (!jwt.startsWith('Bearer ')) return verify(jwt, JWT_SECRET) as JWTPayload;
  return verify(jwt.slice(7), JWT_SECRET) as JWTPayload;
};
