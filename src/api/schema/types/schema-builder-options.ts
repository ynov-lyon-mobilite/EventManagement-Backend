import { CommonContext } from './context';

export type ShemaBuilderOptions = {
  Context: CommonContext;
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
