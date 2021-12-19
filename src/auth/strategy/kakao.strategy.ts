import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: 'http://localhost:3000/user/auth/kakao/callback',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const kakaoId = String(profile.id);
    const user = await this.authService.validateKakao(kakaoId);
    if (user === null) {
      // 유저가 없을때
      done(null, { kakaoId, type: 'kakao' });
    }

    // 유저가 있을때
    done(null, { user, type: 'login' });
  }
}
