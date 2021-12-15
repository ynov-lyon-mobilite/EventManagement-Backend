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
      unit_amount: data.price ?? 0,
    });

    return prisma.eventPrices.create({
      data: {
        event: { connect: { uuid: eventUuid } },
        price: data.price ?? 0,
        description: data.description ?? 'default',
        stripePriceId: price.id,
      },
    });
  }
}
