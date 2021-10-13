import { SessionUserPayload } from '../types';

export const isOwnerOrAdmin = (
  ressourceUuid: string,
  user: SessionUserPayload | undefined
): any => {
  if (!user) return false;
  return ressourceUuid === user.uuid || user.roles.includes('ADMIN');
};
