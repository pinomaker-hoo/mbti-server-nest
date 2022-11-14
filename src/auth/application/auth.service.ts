import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { KakaoDto } from '../dto/passport.kakao.dto';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  /** Kakao Login(Passport) */
  async kakaoLogin(req: KakaoDto): Promise<User> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { providerId: req.providerId },
      });
      if (findUser) return findUser;
      return await this.kakaoSave(req);
    } catch (err) {
      console.log(err);
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }
  }

  /** Kakao Save -> Kakao Login에서 호출 */
  async kakaoSave(req: KakaoDto): Promise<User> {
    try {
      const user = this.userRepository.create({
        email: req.email,
        name: req.name,
        providerId: req.providerId,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
      throw new HttpException('Not Found!!', HttpStatus.BAD_REQUEST);
    }
  }

  /** Jwt를 이용하여 Token 발급 */
  async gwtJwtWithIdx(idx: number) {
    return this.jwtService.sign({ idx });
  }

  /** idx를 이용한 User 조회 */
  async getUserByIdx(idx: number) {
    return await this.userRepository.findOne({ where: { idx } });
  }
}
