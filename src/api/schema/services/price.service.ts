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
  public async createPrices(args: {
    eventUuid: string;
    prices: Pick<EventPrices, 'description' | 'amount'>[];
  }) {
    const event = await prisma.event.findUnique({
      where: { uuid: args.eventUuid },
    });

    return Promise.all(
      args.prices.map(async (price) => {
        const stripePrice = await stripe.prices.create({
          currency: 'eur',
          product: event.stripeProductId,
          unit_amount: price.amount! * 100,
        });

        return prisma.eventPrices.create({
          data: {
            event: { connect: { uuid: args.eventUuid } },
            amount: price.amount ?? 0,
            description: price.description ?? 'default',
            stripePriceId: stripePrice.id,
          },
        });
      })
    );
  }
}
