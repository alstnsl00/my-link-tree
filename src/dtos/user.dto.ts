import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '사용자 URN' })
  readonly userUrn: string;

  @IsEmail()
  @ApiProperty({ description: '사용자 이메일' })
  readonly userEmail: string;

  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly userPw: string;

  @IsString()
  @ApiProperty({ description: '사용자 닉네임' })
  readonly userName: string;

  @IsString()
  @ApiProperty({ description: '사용자 자기소개' })
  readonly userDesc: string;

  @IsString()
  @ApiProperty({ description: '사용자 직업' })
  readonly userJob: string;
}

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty({ description: '사용자 이메일' })
  readonly userEmail: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly userPw?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 닉네임' })
  readonly userName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 자기소개' })
  readonly userDesc?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 직업' })
  readonly userJob?: string;
}
