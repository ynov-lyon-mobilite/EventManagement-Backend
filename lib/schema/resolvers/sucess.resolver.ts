import { builder } from '@lib/schema/builder';

type Success = { success: boolean };

export const SuccessObject = builder
  .objectRef<Success>('Success')
  .implement({ fields: (t) => ({ success: t.exposeBoolean('success', {}) }) });
