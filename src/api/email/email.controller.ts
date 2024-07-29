import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('emails')
@ApiTags('이메일 관련 처리')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/')
  @ApiOperation({ summary: '이메일 중복 체크' })
  async overlap(
    @Body()
    body: {
      userEmail: string;
    },
  ): Promise<object | undefined> {
    return await this.emailService.emailOverlap(body.userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn')
  @ApiOperation({ summary: '이메일 인증 메일 발송' })
  async auth(
    @Param('userUrn') userUrn: string,
    @Body()
    body: {
      userEmail: string;
    },
  ): Promise<void | undefined> {
    return await this.emailService.emailAuth(userUrn, body.userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:userUrn/verify')
  @ApiOperation({ summary: '이메일 인증 처리' })
  async verify(
    @Param('userUrn') userUrn: string,
    @Body()
    body: {
      verifyCode: string;
    },
  ): Promise<void | undefined> {
    return await this.emailService.emailVerify(userUrn, body.verifyCode);
  }
}
