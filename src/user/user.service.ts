import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // TODO 회원가입 부분 추가
    // await bcrypt.hash(pass, 10)
    return 'This action adds a new user';
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
