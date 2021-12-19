import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Err } from './../error';
import * as bcrypt from 'bcrypt';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { CreateSocialUserDto } from './dto/create-social-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async localRegister(createLocalUserDto: CreateLocalUserDto) {
    await this.findUserByEmail(createLocalUserDto.email);
    const hashedPassword = await bcrypt.hash(createLocalUserDto.password, 10);
    return await this.userRepository.save({
      email: createLocalUserDto.email,
      password: hashedPassword,
    });
  }

  async socialRegister(user, createSocialUserDto: CreateSocialUserDto) {
    const socialId = user.id;
    if (user.type === 'login_token') {
      throw new BadRequestException(Err.USER.EXISTING_USER);
    }
    // 1회용 토큰인경우
    else if (user.type === 'kakao') {
      const kakaoId = socialId;
      return await this.userRepository.save({ kakaoAccount: kakaoId });
    } else if (user.type === 'google') {
      const kakaoId = socialId;
      return await this.userRepository.save({ kakaoAccount: kakaoId });
    } else if (user.type === 'naver') {
      const kakaoId = socialId;
      return await this.userRepository.save({ kakaoAccount: kakaoId });
    }
  }

  async findUserByEmail(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    return existingUser;
  }

  async findUserById(id: number) {
    const existingUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    return existingUser;
  }
}
