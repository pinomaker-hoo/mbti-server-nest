import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { KakaoDto } from '../dto/passport.kakao.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: '1af46be84dab779dfebae587510fa1c0',
      callbackURL: 'http://localhost:3009/auth/kakao/callback',
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload: KakaoDto = {
      name: kakao_account.profile.nickname,
      providerId: profileJson.id,
      email:
        kakao_account.has_email && !kakao_account.email_needs_agreement
          ? kakao_account.email
          : null,
    };
    done(null, payload);
  }
}
