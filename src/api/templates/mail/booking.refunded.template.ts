import mjml2html from 'mjml';

type Options = {
  link: string;
  price: number;
  eventTitle: string;
  eventDate: Date;
};

export const comfirmBookingRefund = ({
  link,
  eventDate,
  eventTitle,
  price,
}: Options) =>
  mjml2html(
    `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <p>
                Hi,
              </p> 
              <p>
                Your booking for ${eventTitle} on ${eventDate} has been refunded.
              </p>
              <p>
                Total refunded: ${price}
              </p>
              <p>
                Please click the link below to view your booking details.
              </p>
              <p>
                <a href="${link}">${link}</a>
              </p>
              <p>
                Thank you for using our service.
              </p>
              <p>
                Regards,
              </p>
              <p>
                The Yvent Team
              </p>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `,
    { minify: true }
  );
