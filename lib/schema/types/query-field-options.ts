import { ShemaBuilderOptions } from './schema-builder-options';

export type QueryFieldBuilderOptions = GiraphQLSchemaTypes.QueryFieldBuilder<
  GiraphQLSchemaTypes.ExtendDefaultTypes<ShemaBuilderOptions>,
  {}
>;
