import { EventPrices } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { stripe } from '@api/utils/stripe';

export class PriceService {
  public async createPrice(
    eventUuid: string,
    data: Partial<EventPrices>
  ): Promise<EventPrices> {
    const event = await prisma.event.findUnique({ where: { uuid: eventUuid } });

    const price = await stripe.prices.create({
      currency: 'eur',
      product: event.stripeProductId,
      unit_amount: data.amount! * 100,
    });

    return prisma.eventPrices.create({
      data: {
        event: { connect: { uuid: eventUuid } },
        amount: data.amount ?? 0,
        description: data.description ?? 'default',
        stripePriceId: price.id,
      },
    });
  }

  public async deletePrice(uuid: string) {
    const price = await prisma.eventPrices.findUnique({
      where: { uuid },
      include: { bookings: true },
    });

    if (price.bookings.length > 0) {
      throw new Error('Cannot delete price with bookings');
    }

    await stripe.prices.update(price.stripePriceId, { active: false });

    return prisma.eventPrices.delete({
      where: { uuid },
    });
  }
}
