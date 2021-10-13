import { QueryFieldBuilderOptions } from '@types';

export const paginationArgs = (t: QueryFieldBuilderOptions) => {
  return {
    limit: t.arg.int({ required: false }),
    offset: t.arg.int({ required: false }),
  };
};
