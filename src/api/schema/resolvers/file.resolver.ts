import type { FileType } from 'src/types/types';
import { builder } from '../builder';
import { saveImageToFirebase } from '../services/file.service';

export const FileObject = builder.objectRef<FileType>('File');

builder.objectType(FileObject, {
  fields: (t) => ({
    filename: t.exposeString('filename'),
    mimetype: t.exposeString('mimetype'),
    encoding: t.exposeString('encoding'),
  }),
});

builder.mutationField('testUpload', (t) =>
  t.field({
    type: 'String',
    args: {
      file: t.arg({ type: 'Upload' }),
    },
    resolve: (_, { file }) => {
      return saveImageToFirebase(file);
    },
  })
);
