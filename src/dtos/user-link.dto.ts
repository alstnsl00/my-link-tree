import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUserLinkDto {
  @IsString()
  @ApiProperty({ description: '사용자 링크' })
  readonly link: string;

  @IsString()
  @ApiProperty({ description: '사용자 링크 타입' })
  readonly linkType: string;

  @IsString()
  @ApiProperty({ description: '사용자 링크 제목' })
  readonly linkName: string;
}

export class UpdateUserLinkDto {
  @IsString()
  @ApiProperty({ description: '사용자 링크 번호' })
  readonly linkNum: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 링크' })
  readonly link?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 링크 타입' })
  readonly linkType?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 제목' })
  readonly linkName?: string;
}
