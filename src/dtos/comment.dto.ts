import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @ApiProperty({ description: '댓글 등록한 사용자' })
  readonly whois: string;

  @IsString()
  @ApiProperty({ description: '댓글 내용' })
  readonly note: string;
}
