import { accountValidation } from './account.validation.template';

export const templates = {
  AccountValidation: accountValidation,
};

export type Template = keyof typeof templates;
