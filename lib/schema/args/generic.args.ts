import { InputFieldRef } from '@giraphql/core';
import {
  MutationFieldBuilderOptions,
  QueryFieldBuilderOptions,
} from '../types';

export const uuidArg = (
  t: MutationFieldBuilderOptions | QueryFieldBuilderOptions
) => t.arg.string({ validate: { uuid: true } });

export const objectArgs = <T = {}>(
  opts: {
    [P in keyof T]?: InputFieldRef<T[P], 'Arg'>;
  }
) => opts;

export const objectInput = <T = {}>(
  opts: {
    [P in keyof T]?: InputFieldRef<T[P], 'InputObject'>;
  }
) => opts;
