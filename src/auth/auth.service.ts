import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as CryptoJS from 'crypto-js';
import { Err } from './../error';
import { MailSender } from './mail-sender';
import { SendEmailDto } from './dto/send-email.dto';
import { VerifyCodeDto, VerifyCodeResponseDto } from './dto/verify-code.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailSender: MailSender,
  ) {}

  async sendEmail({ email }: SendEmailDto) {
    /*
    TODO
    인증번호 생성
    인증번호 repository에서 꺼내는 코드
    */
    const verifyCode = '1234';

    try {
      await this.mailSender.send({
        to: email,
        subject: 'Hocaron 메일 인증',
        text: `아래의 코드를 입력해 인증을 완료해 주세요. ${verifyCode} 이 번호는 10분간 유효합니다.`,
      });
    } catch (e) {
      throw new Error(`Error occurred while sending email: ${e}`);
    }
    return { isSend: true };
  }

  async verifyCode({
    email,
    code,
  }: VerifyCodeDto): Promise<VerifyCodeResponseDto> {
    /*
    TODO
    인증번호 repository에서 비교하는 코드
    인증번호 사용 후 삭제하는 코드
    */
    if (code == '1234') {
      return { email, isVerify: true, isCodeExpired: false };
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    const password = await bcrypt.compare(pass, existingUser.password);
    if (password) {
      const { password, ...userWithoutPassword } = existingUser;
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

  async reissueRefreshToken(user: User) {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    const payload = {
      id: user.id,
      nickname: user.nickname,
      type: 'refreshToken',
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '20700m',
    });
    const tokenVerify = await this.tokenValidate(token);
    const tokenExp = new Date(tokenVerify['exp'] * 1000);
    const current_time = new Date();
    const time_remaining = Math.floor(
      (tokenExp.getTime() - current_time.getTime()) / 1000 / 60 / 60,
    );

    if (time_remaining > 10) {
      throw new BadRequestException(Err.TOKEN.JWT_NOT_REISSUED);
    }

    const refresh_token = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    await await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({ refreshToken: refresh_token })
      .where('user.id = :id', { id: user.id })
      .execute();
    const access_token = await this.createAccessToken(user);
    return { access_token, refresh_token: { refresh_token, tokenExp } };
  }
}
