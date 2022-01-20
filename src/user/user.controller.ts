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
import { JwtRefreshGuard } from './../auth/guard/jwt-refresh.guard';
import { SendEmailDto } from './../auth/dto/send-email.dto';
import { VerifyCodeDto } from './../auth/dto/verify-code.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('send-email')
  async sendEmail(@Body() dto: SendEmailDto) {
    return await this.authService.sendEmail(dto);
  }

  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return await this.authService.verifyCode(dto);
  }

  @Post('join')
  async localRegister(@Body() createLocalUserDto: CreateLocalUserDto) {
    return this.userService.localRegister(createLocalUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@User() user) {
    const accessToken = await this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);
    return { accessToken, refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('auth/access-token')
  async getAccessToken(@User() user) {
    const accessToken = await this.authService.createAccessToken(user);
    return { accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('auth/refresh-token')
  async reissueRefreshToken(@User() user) {
    return await this.authService.reissueRefreshToken(user);
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async signInWithKakao() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaocallback(@User() user, @Res() res: Response) {
    if (user.type === 'login') {
      const accessToken = await this.authService.createAccessToken(user.user);
      const refreshToken = await this.authService.createRefreshToken(user.user);
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);
      res.redirect('http://localhost:3000');
      res.end();
    } else {
      const onceToken = await this.authService.createOnceToken(
        user.type,
        user.kakaoId,
      );
      res.cookie('onceToken', onceToken);
      res.redirect('http://localhost:3000');
      res.end();
    }
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google/callback')
  async googlecallback(@User() user, @Res() res: Response): Promise<any> {
    if (user.type === 'login') {
      const accessToken = await this.authService.createAccessToken(user.user);
      const refreshToken = await this.authService.createRefreshToken(user.user);
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);
      res.redirect('http://localhost:3000');
      res.end();
    } else {
      const onceToken = await this.authService.createOnceToken(
        user.type,
        user.googleId,
      );
      res.cookie('onceToken', onceToken);
      res.redirect('http://localhost:3000');
      res.end();
    }
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async naverallback(@User() user, @Res() res: Response): Promise<any> {
    if (user.type === 'login') {
      const accessToken = await this.authService.createAccessToken(user.user);
      const refreshToken = await this.authService.createRefreshToken(user.user);
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);
      res.redirect('http://localhost:3000');
      res.end();
    } else {
      const onceToken = await this.authService.createOnceToken(
        user.type,
        user.naverId,
      );
      res.cookie('onceToken', onceToken);
      res.redirect('http://localhost:3000');
      res.end();
    }
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
