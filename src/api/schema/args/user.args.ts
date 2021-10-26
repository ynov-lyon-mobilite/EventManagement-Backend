import { FieldBuilder } from '../types';

export const usernameArg = (t: FieldBuilder, required: boolean = true) =>
  t.arg.string({ validate: { minLength: 4 }, required });

export const passwordArg = (t: FieldBuilder, required: boolean = true) =>
  t.arg.string({ validate: { minLength: 4 }, required });

export const emailArg = (t: FieldBuilder, required: boolean = true) =>
  t.arg.string({ validate: { email: true }, required });
