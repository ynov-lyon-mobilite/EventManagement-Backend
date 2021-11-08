import { Prisma } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { stripe } from '@api/utils/stripe';
import { hash } from 'bcryptjs';
import { ServiceContainer } from './service.container';

export class UserService extends ServiceContainer {
  public async createUser(data: Prisma.UserCreateInput) {
    const stripeUser = await stripe.customers.create({
      email: data.email,
      name: data.displayName,
      preferred_locales: ['fr-FR'],
    });
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          stripeCustomerId: stripeUser.id,
          password: await hash(data.password, 4),
        },
      });
      await this.services.mail.send('', '', 'AccountValidation', {
        link: `test`,
      });
      return user;
    } catch (error) {
      await stripe.customers.del(stripeUser.id);
      throw error;
    }
  }

  public async updateUser(userUuid: string, data: Prisma.UserUpdateInput) {
    const foundUser = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    const email = data.email ? data.email.toString() : foundUser.email;

    const user = await prisma.user.update({
      where: { uuid: userUuid },
      data,
    });

    if (foundUser.stripeCustomerId) {
      if (data.email !== foundUser.email) {
        await stripe.customers.update(foundUser.stripeCustomerId, {
          email,
        });
      }
    } else {
      await stripe.customers.create({
        email,
      });
    }

    return user;
  }
}
