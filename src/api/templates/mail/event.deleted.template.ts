import mjml2html from 'mjml';

type Options = {
  eventTitle: string;
  eventDate: Date;
};

//Template mail to allert usered that event was deleted and the refund was done
export const eventDeleted = ({ eventTitle, eventDate }: Options) =>
  mjml2html(
    `
    <mjml>
      <mj-head>
        <mj-title>Event deleted</mj-title>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <h1>Event deleted</h1>
              <p>
                Event <b>${eventTitle}</b> was deleted on <b>${eventDate}</b>
              </p>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `,
    { minify: true }
  );
