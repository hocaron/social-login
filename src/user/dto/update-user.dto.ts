import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-local-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
