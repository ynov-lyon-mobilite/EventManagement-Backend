import { MutationFieldBuilderOptions } from '../types';

export const usernameArg = (t: MutationFieldBuilderOptions) =>
  t.arg.string({ validate: { minLength: 4 } });

export const passwordArg = (t: MutationFieldBuilderOptions) =>
  t.arg.string({ validate: { minLength: 4 } });

export const emailArg = (t: MutationFieldBuilderOptions) =>
  t.arg.string({ validate: { email: true } });
