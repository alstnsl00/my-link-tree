import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';

import { generate } from '../../utils/generate.util';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async emailAuth(
    userUrn: string,
    userEmail: string,
  ): Promise<void | undefined> {
    const user = await this.findOneByUrn(userUrn);

    if (userEmail === user.userEmail) {
      const verifyCode = generate(8);
      const emailConfig = {
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWD'),
        },
      };
      const email = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: '[my-link-tree] 이메일 인증 요청 메일입니다.',
        html: `<p> 당신의 인증코드 4자리 코드는 ${verifyCode} 입니다..! </p>`,
      };

      user.updateOne({ verifyCode }).exec();

      const transporter = nodemailer.createTransport(emailConfig);
      transporter.sendMail(email);
    } else {
      throw new BadRequestException('The email address is not valid.');
    }
  }

  async emailVerify(
    userUrn: string,
    verifyCode: string,
  ): Promise<void | undefined> {
    const user = await this.findOneByUrn(userUrn);

    if (user) {
      if (verifyCode === user.verifyCode) {
        user.updateOne({ userValid: true }).exec();
      } else {
        throw new BadRequestException(
          'Your authentication code does not match.',
        );
      }
    } else {
      throw new BadRequestException('The user does not exist.');
    }
  }

  async emailOverlap(userEmail: string): Promise<object | undefined> {
    const isExist = await this.findOneByEmail(userEmail);

    if (isExist) {
      throw new BadRequestException('This email address is already in use.');
    } else {
      return { userEmail };
    }
  }

  async findOneByUrn(userUrn: string): Promise<User | undefined> {
    return this.userModel.findOne({ userUrn }).exec();
  }

  async findOneByEmail(userEmail: string): Promise<User | undefined> {
    return this.userModel.findOne({ userEmail }).exec();
  }
}
