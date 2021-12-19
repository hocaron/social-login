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
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { AuthService } from './../auth/auth.service';
import { LocalAuthGuard } from './../auth/guard/local-auth.guard';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from '../common/decorator/user.decorator';
import { KakaoAuthGuard } from './../auth/guard/kakao-auth.guard';
import { Response } from 'express';
import { GoogleAuthGuard } from './../auth/guard/google-auth.guard';
import { NaverAuthGuard } from './../auth/guard/naver-auth.guard';
import { CreateSocialUserDto } from './dto/create-social-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('join')
  async localRegister(@Body() createLocalUserDto: CreateLocalUserDto) {
    return this.userService.localRegister(createLocalUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/email')
  async login(@User() user) {
    const accessToken = await this.authService.createAccessToken(user);
    return { accessToken };
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
      const accessToken = await this.authService.createAccessToken(req.user);
      res.cookie('accessToken', accessToken);
    } else {
      const onceToken = await this.authService.createOnceToken(
        req.user.type,
        req.user.kakaoId,
      );
      res.cookie('onceToken', onceToken);
    }
    res.end();
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google/callback')
  async googlecallback(@Req() req, @Res() res: Response): Promise<any> {
    if (req.user.type === 'login') {
      const accessToken = await this.authService.createAccessToken(req.user);
      res.cookie('accessToken', accessToken);
    } else {
      const onceToken = await this.authService.createOnceToken(
        req.user.type,
        req.user.googleId,
      );
      res.cookie('onceToken', onceToken);
    }
    // redirect 해야하는 page 등록
    // res.redirect('http://localhost:3000/main');
    res.end();
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async naverallback(@Req() req, @Res() res: Response): Promise<any> {
    if (req.user.type === 'login') {
      const accessToken = await this.authService.createAccessToken(req.user);
      res.cookie('accessToken', accessToken);
    } else {
      const onceToken = await this.authService.createOnceToken(
        req.user.type,
        req.user.naverId,
      );
      res.cookie('onceToken', onceToken);
    }
    res.end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('join/social')
  async socailRegister(
    @User() user,
    @Body() createSocialUserDto: CreateSocialUserDto,
  ): Promise<any> {
    return await this.userService.socialRegister(user, createSocialUserDto);
  }
}
