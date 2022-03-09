import { EventCategories } from '.prisma/client';
import { db } from '@api/clients/prisma-client';

export class EventCategoryService {
  public getAll(): Promise<EventCategories[]> {
    return db.eventCategories.findMany();
  }

  public getAllActives(): Promise<EventCategories[]> {
    return db.eventCategories.findMany({
      where: { deletedAt: null },
    });
  }

  public deleteEventCategory(uuid: string): Promise<EventCategories> {
    return db.eventCategories.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public restoreEventCategory(uuid: string): Promise<EventCategories> {
    return db.eventCategories.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
