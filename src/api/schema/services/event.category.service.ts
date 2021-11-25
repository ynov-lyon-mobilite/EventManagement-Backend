import { EventCategories } from '.prisma/client';
import { prisma } from '@api/prisma-client';

export class EventCategoryService {
  public getAll(): Promise<EventCategories[]> {
    return prisma.eventCategories.findMany();
  }

  public getAllActives(): Promise<EventCategories[]> {
    return prisma.eventCategories.findMany({
      where: { deletedAt: null },
    });
  }

  public deleteEventCategory(uuid: string): Promise<EventCategories> {
    return prisma.eventCategories.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public restoreEventCategory(uuid: string): Promise<EventCategories> {
    return prisma.eventCategories.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
