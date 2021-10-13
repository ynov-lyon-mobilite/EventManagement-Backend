import { RoleEnum } from '@prisma/client';
import { builder } from '../builder';

builder.enumType(RoleEnum, { name: 'Role' });
