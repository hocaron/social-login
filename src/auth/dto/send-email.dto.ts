import { IsEmail, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  allowEmailDuplicate?: boolean;
}

export class SendEmailResponseDto {
  isSend: boolean;
  isUserExist: boolean;
}
