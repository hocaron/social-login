import { Injectable, UseGuards, Post, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from './../auth/guard/local-auth.guard';

@Injectable()
export class UserService {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login') // 1번
  async login(@Request() req) {
    return req.user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
