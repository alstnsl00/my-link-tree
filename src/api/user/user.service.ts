import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as Jimp from 'jimp';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { generate } from '../../utils/generate.util';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userUrn, userEmail, userPw, userName, userDesc, userJob } =
      createUserDto;
    let isExist = await this.findOneByUrn(userUrn);
    if (isExist) throw new BadRequestException('This URN already exists.');
    isExist = await this.findOneByEmail(userEmail);
    if (isExist)
      throw new BadRequestException('This email address already exists.');

    const hashedPassword = await bcrypt.hash(userPw, 10);

    if (userUrn && userEmail && userPw) {
      const user = new this.userModel({
        userUrn,
        userEmail,
        userPw: hashedPassword,
        userName,
        userDesc,
        userJob,
      });
      return user.save();
    } else {
      throw new BadRequestException(
        'Required information has not been inserted.',
      );
    }
  }

  async updateUser(
    userUrn: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { userEmail, userPw, userName, userDesc, userJob } = updateUserDto;
    const user = await this.findOneByUrn(userUrn);
    if (userEmail === user.userEmail) {
      const data = {
        userUrn,
        userEmail,
      };
      if (userPw) data['hashedPassword'] = await bcrypt.hash(userPw, 10);
      if (userName) data['userName'] = userName;
      if (userDesc) data['userDesc'] = userDesc;
      if (userJob) data['userJob'] = userJob;
      return user.updateOne(data);
    } else {
      throw new BadRequestException(
        'Required information has not been inserted.',
      );
    }
  }

  async deleteUser(userUrn: string, userPw: string): Promise<User> {
    const user = await this.findOneByUrn(userUrn);
    if (userPw && (await bcrypt.compare(userPw, user.userPw))) {
      return user.deleteOne();
    } else {
      throw new BadRequestException('The password do not match.');
    }
  }

  async initPassword(
    userUrn: string,
    userEmail: string,
  ): Promise<void | undefined> {
    const user = await this.findOneByUrn(userUrn);

    if (userEmail === user.userEmail) {
      const initPw = generate(8);
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
        subject: '[my-link-tree] 비밀번호 초기화 메일입니다.',
        html: `<p> 초기화된 비밀번호는 ${initPw} 입니다..! </p>`,
      };

      const hashedPassword = await bcrypt.hash(initPw, 10);
      user.updateOne({ userPw: hashedPassword }).exec();

      const transporter = nodemailer.createTransport(emailConfig);
      transporter.sendMail(email);
    } else {
      throw new BadRequestException('The email address is not valid.');
    }
  }

  async resizeImage(
    userUrn: string,
    imageBuffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    const image = await Jimp.read(imageBuffer);
    image.resize(width, height);
    const imageFile = image.getBufferAsync(Jimp.MIME_JPEG);

    const user = await this.findOneByUrn(userUrn);
    return user.updateOne({ userPhoto: (await imageFile).toString('base64') });
  }

  async findOneByUrn(userUrn: string): Promise<User | undefined> {
    return this.userModel.findOne({ userUrn }).exec();
  }

  async findOneByEmail(userEmail: string): Promise<User | undefined> {
    return this.userModel.findOne({ userEmail }).exec();
  }
}
