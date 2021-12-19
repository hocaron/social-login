import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    const password = await bcrypt.compare(pass, user.password);
    if (password) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async validateKakao(kakaoId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        kakaoAccount: kakaoId,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async validateGoogle(googleId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        googleAccount: googleId,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async validateNaver(naverId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        naverAccount: naverId,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async createOnceToken(socialType: string, socialId: string) {
    const payload = {
      type: socialType,
      id: socialId,
    };
    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  async createAccessToken(user: any) {
    const payload = {
      type: 'accessToken',
      id: user.id,
      nickname: user.nickname,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    return accessToken;
  }

  async createRefreshToken(user: User) {
    const payload = {
      type: 'refreshToken',
      id: user.id,
      nickname: user.nickname,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '20700m',
    });
    const tokenVerify = await this.tokenValidate(token);
    const tokenExp = new Date(tokenVerify['exp'] * 1000);

    const refreshToken = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    await await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({ refreshToken: refreshToken })
      .where('user.id = :id', { id: user.id })
      .execute();
    return { refreshToken, tokenExp };
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
