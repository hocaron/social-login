import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './../auth/auth.service';
import { LocalAuthGuard } from './../auth/guard/local-auth.guard';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from './../common/user.decorator';
import { KakaoAuthGuard } from './../auth/guard/kakao-auth.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user) {
    return user;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaocallback(@Req() req, @Res() res: Response): Promise<any> {
    if (req.user.type === 'login') {
      return this.authService.login(req.user);
    } else {
      res.cookie('once_token', req.user.once_token);
    }
    // redirect 해야하는 page 등록
    // res.redirect('http://localhost:3000/main');
    // res.end();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
}
