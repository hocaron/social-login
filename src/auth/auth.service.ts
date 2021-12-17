import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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

  async validateKakao(kakaoId: number): Promise<any> {
    const user = await this.userService.findUserBykakaoAccount(kakaoId);
    if (!user) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
