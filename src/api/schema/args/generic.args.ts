import { InputFieldRef } from '@giraphql/core';
import {
  MutationFieldBuilderOptions,
  QueryFieldBuilderOptions,
} from '../types';

export const uuidArg = (
  t: MutationFieldBuilderOptions | QueryFieldBuilderOptions,
  required: boolean = true
) => t.arg.string({ validate: { uuid: true }, required });

// export const objectArgs = <B = keyof {}>(opts: {
//   [P in string & keyof B]?: InputFieldRef<B[P], 'Arg'>;
// }) => opts;

export const objectArgs = <T>(
  opts: {
    [Q in string & keyof T]?: InputFieldRef<T[Q], 'Arg'>;
  }
) => opts;

export const objectInput = <T = keyof {}>(
  opts: {
    [P in keyof T]?: InputFieldRef<T[P], 'InputObject'>;
  }
) => opts;

// function createPerson<D extends keyof Person>(
//   personData: Pick<Person, D>
// ): Pick<Person, D> & AdditionalProperties {
//   return Object.assign({}, personData, { groups: [] });
// }
