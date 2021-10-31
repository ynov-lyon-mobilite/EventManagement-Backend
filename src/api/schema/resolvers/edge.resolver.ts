import { ImplementableObjectRef, InputShapeFromFields } from '@giraphql/core';
import { cursorArgs } from '../args/pagination.args';
import { builder } from '../builder';
import { ShemaBuilderOptions } from '../types';

export type TypeType<T> = ImplementableObjectRef<
  GiraphQLSchemaTypes.ExtendDefaultTypes<ShemaBuilderOptions>,
  T,
  T
>;

type CursorInfo = {
  cursor: {
    take: number;
    total: number;
    current: string | null;
  };
};

type PageInfo = {
  pageInfo: {
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type EdgeInfo<T> = {
  edges: T[];
};

export type Fusion<T> = CursorInfo & PageInfo & EdgeInfo<T>;

export const CursorObject = builder.objectRef<CursorInfo['cursor']>('Cursor');
export const PageInfoObject = builder.objectRef<PageInfo['pageInfo']>(
  'PageInfo'
);

builder.objectType(CursorObject, {
  fields: (t) => ({
    current: t.expose('current', { type: 'CursorID', nullable: true }),
    take: t.exposeInt('take'),
    total: t.exposeInt('total'),
  }),
});

builder.objectType(PageInfoObject, {
  fields: (t) => ({
    totalPages: t.exposeInt('totalPages'),
    currentPage: t.exposeInt('currentPage'),
    hasNextPage: t.exposeBoolean('hasNextPage'),
    hasPreviousPage: t.exposeBoolean('hasPreviousPage'),
  }),
});

export const createConnection = <T extends { uuid: string }>(
  object: TypeType<T>
) => {
  const objectConnection = object.name.concat('Connection');
  const connectionRef = builder.objectRef<Fusion<T>>(objectConnection);
  const objectNode = object.name.concat('Node');
  const nodeRef = builder.objectRef<Fusion<T>['edges'][number]>(objectNode);

  const edgeType = builder.objectType(nodeRef, {
    name: objectNode,
    fields: (t) => ({
      cursor: t.field({
        type: 'CursorID',
        resolve: ({ uuid }) => uuid,
      }),
      node: t.field({
        type: object,
        resolve: (all) => all as any, // Why the fuck
      }),
    }),
  });

  connectionRef.implement({
    fields: (t) => ({
      pageInfo: t.field({
        type: PageInfoObject,
        resolve: (root) => root.pageInfo,
      }),
      edges: t.field({
        type: [edgeType],
        resolve: (root) => root.edges,
      }),
      cursor: t.field({ type: CursorObject, resolve: (root) => root.cursor }),
    }),
  });

  return connectionRef;
};

type CallbackParameter<T> = (() => Promise<T>) | Promise<T> | T;

type CreatePaginationProps<T> = {
  count: CallbackParameter<number>;
  edges: CallbackParameter<Array<T>>;
  args: InputShapeFromFields<ReturnType<typeof cursorArgs>>;
};

export const createConnectionObject = async <T extends { uuid: string }>({
  count: ctOpt,
  edges: edOpt,
  args,
}: CreatePaginationProps<T>): Promise<Fusion<T>> => {
  const countPromise = Promise.resolve(
    typeof ctOpt === 'function' ? ctOpt() : ctOpt
  );

  const edgesPromise = Promise.resolve(
    typeof edOpt === 'function' ? edOpt() : edOpt
  );

  const [count, edges] = await Promise.all([countPromise, edgesPromise]);

  const cursor = args.cursor ? args.cursor : null;

  return {
    cursor: {
      current: cursor,
      take: Math.abs(getTakeArgument(args)),
      total: count,
    },
    edges,
    pageInfo: computePageInfos(args, count),
  };
};

const computePageInfos = (
  args: InputShapeFromFields<ReturnType<typeof cursorArgs>>,
  count: number
): PageInfo['pageInfo'] => {
  const take = getTakeArgument(args);

  const totalPages = Math.abs(Math.ceil(count / take));

  const response: PageInfo['pageInfo'] = {
    currentPage: args.targetPage ?? args.currentPage!,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages,
  };

  if (response.currentPage <= 0) response.currentPage = 1;
  if (response.currentPage > totalPages) response.currentPage = totalPages;

  response.hasNextPage = response.currentPage !== totalPages;
  response.hasPreviousPage = response.currentPage !== 1;

  return response;
};

export const getTakeArgument = (
  args: InputShapeFromFields<ReturnType<typeof cursorArgs>>
) => {
  const value = args.take! || 10;
  if (args.targetPage && args.currentPage! > args.targetPage) {
    return -Math.abs(value);
  }
  return value;
};
