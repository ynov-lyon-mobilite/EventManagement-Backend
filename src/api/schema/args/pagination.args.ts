import { InputShapeFromFields } from '@giraphql/core';
import { QueryFieldBuilderOptions } from '@types';
import { getTakeArgument } from '../resolvers/edge.resolver';

export const paginationArgs = (t: QueryFieldBuilderOptions) => {
  return {
    limit: t.arg.int({ required: false }),
  };
};

export const cursorArgs = (t: QueryFieldBuilderOptions) => {
  return {
    take: t.arg.int({
      required: false,
      defaultValue: 10,
      description: 'Max 50, Min 1',
      validate: {
        min: [1, { message: '1 min per request !' }],
        max: [50, { message: '50 max per request' }],
      },
    }),
    cursor: t.arg({ type: 'CursorID', required: false }),
    page: t.arg.int({ required: false, defaultValue: 1 }),
  };
};

export const generateCursorFindMany = (
  args: InputShapeFromFields<ReturnType<typeof cursorArgs>>
): GenericCursorArgs => {
  const findArgs: GenericCursorArgs = {
    skip: 0,
  };

  const getCursorArgs = (crs: string | null | undefined) => {
    if (!crs) {
      return {
        skip: args.take! * (args.page! - 1),
      };
    }

    return {
      cursor: {
        uuid: crs,
      },
      skip: 1,
    };
  };

  const cursorOpts = getCursorArgs(args.cursor);
  if (cursorOpts) {
    findArgs.cursor = cursorOpts.cursor;
    findArgs.skip = cursorOpts.skip;
  }
  findArgs.take = getTakeArgument(args);

  return findArgs;
};

type GenericCursorArgs = {
  cursor?: { uuid?: string };
  take?: number;
  skip?: number;
};
