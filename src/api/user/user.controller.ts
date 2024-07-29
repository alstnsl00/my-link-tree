import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserLinkService } from './user-link.service';
import { UserLikeService } from './user-like.service';
import { User } from '../../schemas/user.schema';
import { UserLink } from '../../schemas/user-link.schema';
import { UserLike } from '../../schemas/user-like.schema';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';
import { CreateUserLinkDto, UpdateUserLinkDto } from '../../dtos/user-link.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@ApiTags('사용자 관련 처리')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userLinkService: UserLinkService,
    private readonly userLikeService: UserLikeService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: '사용자 등록' })
  async register(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userUrn')
  @ApiOperation({ summary: '사용자 정보 수정' })
  async modify(
    @Param('userUrn')
    userUrn: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.updateUser(userUrn, updateUserDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userUrn/link')
  @ApiOperation({ summary: '사용자 링크 정보 수정' })
  async modifyLink(
    @Param('userUrn')
    userUrn: string,
    @Body()
    updateUserLinkDto: UpdateUserLinkDto,
  ): Promise<UserLink> {
    const user = await this.userLinkService.updateUserLink(
      userUrn,
      updateUserLinkDto,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userUrn')
  @ApiOperation({ summary: '사용자 삭제' })
  async remove(
    @Param('userUrn')
    userUrn: string,
    @Body()
    body: {
      userPw: string;
    },
  ): Promise<User> {
    const user = await this.userService.deleteUser(userUrn, body.userPw);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/link')
  @ApiOperation({ summary: '사용자 링크 정보 등록' })
  async registerLink(
    @Param('userUrn')
    userUrn: string,
    @Body()
    createUserLinkDto: CreateUserLinkDto,
  ): Promise<UserLink> {
    const user = await this.userLinkService.createUserLink(
      userUrn,
      createUserLinkDto,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/like')
  @ApiOperation({ summary: '사용자 좋아요 클릭' })
  async registerLike(
    @Param('userUrn')
    userUrn: string,
    @Body()
    body: { likeUrn: string },
  ): Promise<UserLike> {
    const user = await this.userLikeService.createUserLike(
      userUrn,
      body.likeUrn,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/search')
  @ApiOperation({ summary: '사용자 비밀번호 재설정' })
  async search(
    @Param('userUrn')
    userUrn: string,
    @Body()
    body: { userEmail: string },
  ): Promise<void | undefined> {
    return await this.userService.initPassword(userUrn, body.userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/upload')
  @ApiOperation({ summary: '사용자 프로필 업로드' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('userUrn')
    userUrn: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void | undefined> {
    if (!file) throw new BadRequestException('No file uploaded.');

    try {
      await this.userService.resizeImage(userUrn, file.buffer, 512, 512);
      res.redirect(`/:userUrn`);
    } catch (e) {
      throw new InternalServerErrorException('Error processing image.');
    }
  }

  @Post('/:userUrn/link/:clickId')
  @ApiOperation({ summary: '사용자 링크 클릭' })
  async click(
    @Param('userUrn')
    userUrn: string,
    @Param('clickId')
    clickId: string,
  ): Promise<UserLink | undefined> {
    return await this.userLinkService.clickLink(userUrn, clickId);
  }
}
