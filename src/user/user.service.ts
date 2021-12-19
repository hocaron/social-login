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
    const existingEmail = await this.userRepository.findOne({
      where: {
        email: createLocalUserDto.email,
      },
    });
    if (existingEmail) {
      throw new BadRequestException(Err.USER.EXISTING_USER);
    }
    const existingNickname = await this.userRepository.findOne({
      where: {
        nickname: createLocalUserDto.nickname,
      },
    });
    if (existingNickname) {
      throw new BadRequestException(Err.USER.EXISTING_USER);
    }
    const hashedPassword = await bcrypt.hash(createLocalUserDto.password, 10);
    return await this.userRepository.save({
      email: createLocalUserDto.email,
      password: hashedPassword,
      nickname: createLocalUserDto.nickname,
    });
  }

  async socialRegister(user, createSocialUserDto: CreateSocialUserDto) {
    if (user.type === 'login') {
      throw new BadRequestException(Err.USER.EXISTING_USER);
    }
    // 1회용 토큰인경우
    if (user.type === 'kakao') {
      return await this.userRepository.save({
        email: createSocialUserDto.email,
        kakaoAccount: user.id,
        nickname: createSocialUserDto.nickname,
      });
    } else if (user.type === 'google') {
      return await this.userRepository.save({
        email: createSocialUserDto.email,
        googleAccount: user.id,
        nickname: createSocialUserDto.nickname,
      });
    } else if (user.type === 'naver') {
      return await this.userRepository.save({
        email: createSocialUserDto.email,
        naverAccount: user.id,
        nickname: createSocialUserDto.nickname,
      });
    }
  }

  async findUserByEmail(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: email,
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
