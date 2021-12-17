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
    const user_email = profile._json.kakao_account.email;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
    };
    const user = await this.authService.validateKakao(user_email);
    if (user === null) {
      // 유저가 없을때
      return { user_profile, type: 'once' };
    }

    // 유저가 있을때
    return { user, type: 'login' };
  }
}
