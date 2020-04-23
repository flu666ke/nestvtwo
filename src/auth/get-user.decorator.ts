import { createParamDecorator } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';

export const GetUser = createParamDecorator(
  (data, req): IUser => {
    return req.user;
  },
);
