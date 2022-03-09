import { FileUpload } from 'graphql-upload';
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
    Upload: {
      Input: Promise<FileUpload>;
      Output: FileUpload;
    };
  };
  AuthScopes: {
    isLogged: boolean;
    isAdmin: boolean;
  };
  DefaultInputFieldRequiredness: true;
};
