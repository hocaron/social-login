import { IsEmail } from 'class-validator';

export class VerifyCodeDto {
  @IsEmail()
  email: string;

  code: string;
}

export class VerifyCodeResponseDto {
  @IsEmail()
  email: string;

  isCodeExpired: boolean;

  isVerify: boolean;
}
