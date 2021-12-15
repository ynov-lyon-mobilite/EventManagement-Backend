import { Booking, Prisma } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { Service } from './service';

export class BookingService extends Service {
  public async createBooking(
    datas: Prisma.BookingCreateInput
  ): Promise<Booking> {
    const booking = await prisma.booking.create({
      data: datas,
      include: { user: true, eventPrice: { include: { event: true } } },
    });
    const eventTitle = booking.eventPrice.event.title;
    await this.mail.send(
      booking.user.email,
      `Réservation ${eventTitle}`,
      'BookingConfirmation',
      { eventTitle: eventTitle, price: booking.eventPrice.price }
    );

    return booking;
  }

  public refundBooking(bookingId: string): Promise<Booking> {
    // TODO: check if booking date can be refunded
    // TODO: Implement logic to refund booking
    // TODO: send email to user to confirme refund
    return prisma.booking.update({
      where: { uuid: bookingId },
      data: {
        refundedAt: new Date(),
      },
    });
  }
}
