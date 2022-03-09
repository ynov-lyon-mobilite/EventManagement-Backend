import { firebaseBucket } from '@api/clients/firebase';
import { FileUpload } from 'graphql-upload';

type File = FileUpload | Promise<FileUpload>;

export const saveImageToFirebase = async (arg: File): Promise<string> => {
  const upload = await arg;

  const { filename, mimetype, encoding, createReadStream } = upload;

  const finalFileName = `${Date.now()}-${filename}`;
  await firebaseBucket.makePublic({ force: true });

  const file = firebaseBucket.file(finalFileName);

  const writeStream = file.createWriteStream({
    metadata: {
      encoding,
      contentType: mimetype,
    },
  });

  const readStream = createReadStream();

  const pipeStream = readStream.pipe(writeStream);

  await new Promise<void>((resolve, reject) => {
    pipeStream.on('error', function (err) {
      reject(err);
    });
    pipeStream.on('finish', function () {
      resolve();
    });
  });

  return file.publicUrl();
};
