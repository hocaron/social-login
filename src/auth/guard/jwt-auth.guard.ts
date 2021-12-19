import {
  ExecutionContext,
  Injectable,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Err } from './../../error';
import { UserService } from './../../user/user.service';
import { AuthService } from './../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new BadRequestException(Err.TOKEN.NOT_SEND_TOKEN);
    }

    const token = authorization.replace('Bearer ', '');
    const tokenValidate = await this.validate(token);
    request.user = tokenValidate.user ? tokenValidate.user : tokenValidate;
    return true;
  }

  async validate(token: string) {
    try {
      // 토큰 검증
      const tokenVerify = await this.authService.tokenValidate(token);
      if (tokenVerify.type === 'accessToken') {
        return await this.userService.findUserById(tokenVerify.id);
      } else {
        return tokenVerify;
      }
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new BadRequestException(Err.TOKEN.INVALID_TOKEN);

        case 'invalid signature':
          throw new BadRequestException(Err.TOKEN.INVALID_TOKEN);

        case 'jwt expired':
          throw new BadRequestException(Err.TOKEN.JWT_EXPIRED);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
