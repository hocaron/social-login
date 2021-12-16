import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user_email = profile._json.kakao_account.email;
    const user_nick = profile._json.properties.nickname;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
    };
    const user = await this.authService.validateKakao(user_email);
}
