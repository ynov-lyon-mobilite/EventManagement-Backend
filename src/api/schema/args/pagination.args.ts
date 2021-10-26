import { QueryFieldBuilderOptions } from 'src/api/schema/types';

export const paginationArgs = (t: QueryFieldBuilderOptions) => {
  return {
    limit: t.arg.int({ required: false }),
    offset: t.arg.int({ required: false }),
  };
};
