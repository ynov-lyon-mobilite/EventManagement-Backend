import { ShemaBuilderOptions } from './schema-builder-options';

export type QueryFieldBuilderOptions =
  | GiraphQLSchemaTypes.QueryFieldBuilder<
      GiraphQLSchemaTypes.ExtendDefaultTypes<ShemaBuilderOptions>,
      {}
    >
  | GiraphQLSchemaTypes.ObjectFieldBuilder<
      GiraphQLSchemaTypes.ExtendDefaultTypes<ShemaBuilderOptions>,
      {}
    >;

export type MutationFieldBuilderOptions = GiraphQLSchemaTypes.MutationFieldBuilder<
  GiraphQLSchemaTypes.ExtendDefaultTypes<ShemaBuilderOptions>,
  {}
>;

export type FieldBuilder =
  | MutationFieldBuilderOptions
  | QueryFieldBuilderOptions;
