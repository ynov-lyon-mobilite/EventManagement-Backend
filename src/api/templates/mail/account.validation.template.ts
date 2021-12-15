import mjml2html from 'mjml';

type Options = {
  displayName: string;
  email: string;
};

export const accountCreated = ({ displayName, email }: Options) =>
  mjml2html(
    `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="20px" font-family="helvetica" font-weight="bold">
            Welcome to Yvent!
          </mj-text>
          <mj-text font-size="16px" font-family="helvetica" font-weight="bold">
            ${displayName}
          </mj-text>
          <mj-text font-size="16px" font-family="helvetica" font-weight="bold">
            ${email}
          </mj-text> 
          <mj-text font-size="16px" font-family="helvetica" font-weight="bold">
            Your account has been created.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `
  );
