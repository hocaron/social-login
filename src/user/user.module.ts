import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './../auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailSender } from 'src/auth/mail-sender';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UserService, AuthService, MailSender],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
