import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import KakaoGuard from '../passport/auth.kakao.guard';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao')
  @HttpCode(200)
  @UseGuards(KakaoGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/callback')
  @HttpCode(200)
  @UseGuards(KakaoGuard)
  async kakaoCallBack(@Req() req, @Res() res: Response) {
    const user = await this.authService.kakaoLogin(req.user);
    const token = await this.authService.gwtJwtWithIdx(user.idx);
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    });
    return res.redirect('http://localhost:3000/admin');
  }
}
