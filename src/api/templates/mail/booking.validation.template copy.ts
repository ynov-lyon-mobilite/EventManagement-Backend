import mjml2html from 'mjml';

type Options = {
  eventTitle: string;
  price: number;
};

export const confirmBooking = ({ eventTitle, price }: Options) =>
  mjml2html(
    `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <p>
                Hello,
              </p>
              <p>
                You have successfully booked a ticket for the event:
              </p>
              <p>
                ${eventTitle}
              </p>
              <p>
                The price is:
              </p>
              <p>
                ${price} €
              </p>
              <p>
                Thank you for your booking!
              </p>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `,
    { minify: true }
  );
