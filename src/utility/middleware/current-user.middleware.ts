import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log(req);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        //   console.log(token);
        const { id } = <jwtPayload>verify(token, 'secret key');
        const currentUser = await this.usersService.findOne(+id);
        //   console.log(currentUser);
        req.currentUser = currentUser;
        next();
      } catch (e) {
        console.log(e);
        req.currentUser = null;
        next();
      }
    }
  }
}
interface jwtPayload {
  id: string;
}
