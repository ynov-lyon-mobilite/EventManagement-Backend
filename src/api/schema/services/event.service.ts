import { Event, Prisma, User } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { stripe } from '@api/utils/stripe';
import { addDays } from 'date-fns';

export class EventService {
  public async createEvent(
    event: Omit<Prisma.EventCreateInput, 'stripeProductId'>
  ): Promise<Event> {
    const product = await stripe.products.create({
      name: event.title,
      description: `${event.title} - ${event.startDate.toLocaleString()} ${
        event.endDate ? event.endDate.toLocaleString() : ''
      }}`,
    });

    if (!event.endDate) event.endDate = addDays(new Date(event.startDate), 1);

    return prisma.event.create({
      data: {
        ...event,
        stripeProductId: product.id,
      },
    });
  }

  public async updateEvent(
    eventUuid: string,
    event: Prisma.EventUpdateInput
  ): Promise<Event> {
    //TODO: Notify user who already booked of the changes
    //TODO: check date changes
    return prisma.event.update({
      where: {
        uuid: eventUuid,
      },
      data: {
        ...event,
      },
    });
  }

  public async deleteEvent(eventUuid: string): Promise<Event> {
    // TODO: Notify users
    // TODO: Refund converned users
    return prisma.event.update({
      where: {
        uuid: eventUuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public async joinEvent(
    user: User,
    eventUuid: string,
    priceUuid: string,
    succesUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const price = await prisma.eventPrices.findUnique({
      include: {
        event: true,
      },
      where: {
        uuid: priceUuid,
      },
    });
    const isSameEvent = price.event.uuid === eventUuid;
    if (!isSameEvent) throw new Error('Price do not match the event');

    if (price.amount === 0) {
      await prisma.eventPrices.update({
        where: {
          uuid: priceUuid,
        },
        data: {
          bookings: {
            create: {
              user: { connect: { email: user.email } },
            },
          },
        },
      });
    }

    if (!user.stripeCustomerId) {
      const stripeUser = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        preferred_locales: ['fr-FR'],
      });
      user.stripeCustomerId = stripeUser.id;
    }

    const chechout = await stripe.checkout.sessions.create({
      cancel_url: cancelUrl,
      success_url: succesUrl,
      customer: user.stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price: price.stripePriceId,
        },
      ],
    });

    return chechout.url!;
  }
}
