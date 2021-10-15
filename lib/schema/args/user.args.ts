import { MutationFieldBuilderOptions } from '../types';

export const usernameArg = (
  t: MutationFieldBuilderOptions,
  required: boolean = true
) => t.arg.string({ validate: { minLength: 4 }, required });

export const passwordArg = (
  t: MutationFieldBuilderOptions,
  required: boolean = true
) => t.arg.string({ validate: { minLength: 4 }, required });

export const emailArg = (
  t: MutationFieldBuilderOptions,
  required: boolean = true
) => t.arg.string({ validate: { email: true }, required });
