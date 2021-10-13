import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="text-gray-800 font-Inter bg-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
