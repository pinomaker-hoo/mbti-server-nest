import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './application/auth.service';
import { UserRepository } from './infrastructure/user.repository';
import { JwtStrategy } from './passport/auth.jwt.strategy';
import { KakaoStrategy } from './passport/auth.kakao.strategy';
import AuthController from './ui/auth.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRESIN'),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, KakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
