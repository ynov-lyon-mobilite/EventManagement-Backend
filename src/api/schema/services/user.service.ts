import { Prisma } from '.prisma/client';
import { db } from '@api/clients/prisma-client';
import { stripe } from '@api/utils/stripe';
import { hash } from 'bcryptjs';
import { Stripe } from 'stripe';
import { Service } from './service';

export class UserService extends Service {
  public async createUser(data: Prisma.UserCreateInput) {
    const stripeUser = await stripe.customers.create({
      email: data.email,
      name: data.displayName,
      preferred_locales: ['fr-FR'],
    });
    try {
      const password = data.password
        ? await hash(data.password, 10)
        : undefined;

      const user = await db.user.create({
        data: {
          ...data,
          stripeCustomerId: stripeUser.id,
          password,
        },
      });
      await this.mail.send(
        user.email,
        'Compte créé sur Yvent',
        'AccountCreated',
        {
          displayName: user.displayName,
          email: user.email,
        }
      );
      return user;
    } catch (error) {
      await stripe.customers.del(stripeUser.id);
      throw error;
    }
  }

  public async updateUser(userUuid: string, datas: Prisma.UserUpdateInput) {
    const user = await db.user.findUnique({ where: { uuid: userUuid } });

    let customer: Stripe.Customer | undefined = undefined;

    if (user.stripeCustomerId && datas.email) {
      customer = await stripe.customers.update(user.stripeCustomerId, {
        email: datas.email.toString(),
      });
    } else if (!user.stripeCustomerId && datas.email) {
      customer = await stripe.customers.create({
        email: datas.email.toString(),
      });
    }

    if (customer) {
      datas.stripeCustomerId = customer.id;
    }

    return db.user.update({
      where: { uuid: userUuid },
      data: {
        ...datas,
      },
    });
  }
}
