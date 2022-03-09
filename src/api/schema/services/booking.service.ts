import { Booking, Prisma } from '.prisma/client';
import { db } from '@api/clients/prisma-client';
import { Service } from './service';

export class BookingService extends Service {
  public async createBooking(
    datas: Prisma.BookingCreateInput
  ): Promise<Booking> {
    const booking = await db.booking.create({
      data: datas,
      include: { user: true, eventPrice: { include: { event: true } } },
    });
    const eventTitle = booking.eventPrice.event.title;
    await this.mail.send(
      booking.user.email,
      `Réservation ${eventTitle}`,
      'BookingConfirmation',
      { eventTitle: eventTitle, price: booking.eventPrice.amount }
    );

    return booking;
  }

  public refundBooking(bookingId: string): Promise<Booking> {
    // TODO: check if booking date can be refunded
    // TODO: Implement logic to refund booking
    // TODO: send email to user to confirme refund
    return db.booking.update({
      where: { uuid: bookingId },
      data: {
        refundedAt: new Date(),
      },
    });
  }
}
