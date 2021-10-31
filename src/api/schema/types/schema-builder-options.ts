import { Context } from './context';

export type ShemaBuilderOptions = {
  Context: Context;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    CursorID: {
      Input: string;
      Output: string;
    };
  };
  AuthScopes: {
    isLogged: boolean;
    isAdmin: boolean;
  };
  DefaultInputFieldRequiredness: true;
};
