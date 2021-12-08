import { Event, Prisma } from '.prisma/client';
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

    event.endDate = addDays(new Date(event.startDate), 1);
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
}
