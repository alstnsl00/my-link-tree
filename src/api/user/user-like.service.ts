import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserLike, UserLikeDocument } from '../../schemas/user-like.schema';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectModel(UserLike.name) private userLikeModel: Model<UserLikeDocument>,
  ) {}

  async createUserLike(userUrn: string, likeUrn: string): Promise<UserLike> {
    const isExist = await this.findOneByUrn(userUrn, likeUrn);

    if (isExist) {
      if (userUrn) {
        return isExist.updateOne({ likeFlag: !isExist.likeFlag });
      } else {
        throw new BadRequestException(
          'Required information has not been inserted.',
        );
      }
    } else {
      if (userUrn) {
        const userLike = new this.userLikeModel({
          userUrn,
          likeUrn,
          likeFlag: 1,
        });
        return userLike.save();
      } else {
        throw new BadRequestException(
          'Required information has not been inserted.',
        );
      }
    }
  }

  async findOneByUrn(
    userUrn: string,
    likeUrn: string,
  ): Promise<UserLike | undefined> {
    return this.userLikeModel.findOne({ userUrn, likeUrn }).exec();
  }
}
