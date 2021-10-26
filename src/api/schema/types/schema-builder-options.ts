import { Context } from './context';

export type ShemaBuilderOptions = {
  Context: Context;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  AuthScopes: {
    isLogged: boolean;
    isAdmin: boolean;
  };
  DefaultInputFieldRequiredness: true;
};
