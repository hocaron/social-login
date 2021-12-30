import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../user/entities/user.entity';
import { UserModule } from './../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { MailSender } from './mail-sender';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    JwtModule,
    LocalStrategy,
    JwtStrategy,
    KakaoStrategy,
    GoogleStrategy,
    NaverStrategy,
    MailSender,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
