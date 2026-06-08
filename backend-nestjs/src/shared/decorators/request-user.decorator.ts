import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  async (isOptional: string, ctx: ExecutionContext) => {
    const isRequired = !isOptional;
    const user = ctx.switchToHttp().getRequest().user;

    if (isRequired && (!user || user.deletedAt))
      throw new Error('Invalid user');

    return user;
  },
);

export const RequestSystemUser = createParamDecorator(
  async (isOptional: string, ctx: ExecutionContext) => {
    const isRequired = !isOptional;
    const user = ctx.switchToHttp().getRequest().activeSystemUser;

    if (isRequired && (!user || user.deletedAt))
      throw new Error('Invalid system user');

    return user;
  },
);
