import mjml2html from 'mjml';

type Options = {
  link: string;
};

export const accountValidation = ({ link }: Options) =>
  mjml2html(
    `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" font-family="helvetica" font-weight="bold" color="#000000">
          Account validation
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          Hello,
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          Thank you for registering with us.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          Please click on the link below to validate your account.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-button href="${link}">
          Validate account
        </mj-button>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          If you did not register with us, please ignore this email.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          Thank you,
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" font-family="helvetica" font-weight="bold" color="#000000">
          The Yvent team
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
  );
