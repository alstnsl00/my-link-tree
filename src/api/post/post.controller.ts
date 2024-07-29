import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreateCommentDto } from '../../dtos/comment.dto';
import { Comment } from '../../schemas/comment.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
@ApiTags('사용자 링크 관련 처리')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:userUrn')
  @ApiOperation({ summary: '사용자 링크 조회' })
  async read(
    @Param('userUrn')
    userUrn: string,
  ): Promise<object | undefined> {
    return await this.postService.postRead(userUrn);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/comments')
  @ApiOperation({ summary: '사용자 링크 댓글 등록' })
  async register(
    @Param('userUrn')
    userUrn: string,
    @Body()
    createCommentDto: CreateCommentDto,
  ): Promise<Comment | undefined> {
    return await this.postService.createComment(userUrn, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userUrn/comments/:commentId')
  @ApiOperation({ summary: '사용자 링크 댓글 삭제' })
  async remove(
    @Param('userUrn')
    userUrn: string,
    @Param('commentId')
    commentId: string,
  ): Promise<Comment | undefined> {
    return await this.postService.deleteComment(userUrn, commentId);
  }
}
