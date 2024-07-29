import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserLink, UserLinkDocument } from '../../schemas/user-link.schema';
import { UserLike, UserLikeDocument } from '../../schemas/user-like.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateCommentDto } from '../../dtos/comment.dto';
import { generate } from '../../utils/generate.util';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserLink.name) private userLinkModel: Model<UserLinkDocument>,
    @InjectModel(UserLike.name) private userLikeModel: Model<UserLikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async postRead(userUrn: string): Promise<object | undefined> {
    const user = await this.findOneByUrn(userUrn);

    if (user) {
      const userLink = await this.findOneByUrnLink(userUrn);
      const userLike = await this.findOneByUrnLike(userUrn);

      return { user, userLink, userLike };
    } else {
      throw new BadRequestException('The user does not exist.');
    }
  }

  async createComment(
    userUrn: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.findOneByUrn(userUrn);
    const { whois, note } = createCommentDto;

    if (user) {
      const comment = new this.commentModel({
        commentId: generate(8),
        userUrn,
        whois,
        note,
      });
      return comment.save();
    } else {
      throw new BadRequestException('The user does not exist.');
    }
  }

  async deleteComment(
    userUrn: string,
    commentId: string,
  ): Promise<Comment | undefined> {
    const user = this.commentModel.findOne({ userUrn, commentId });
    return user.deleteOne();
  }

  async findOneByUrn(userUrn: string): Promise<User | undefined> {
    return this.userModel.findOne({ userUrn }).exec();
  }

  async findOneByUrnLink(userUrn: string): Promise<UserLink | undefined> {
    return this.userLinkModel.findOne({ userUrn }).sort('-linkNum').exec();
  }

  async findOneByUrnLike(userUrn: string): Promise<UserLike | undefined> {
    return this.userLikeModel.findOne({ userUrn }).exec();
  }

  async findOneByUrnComment(
    userUrn: string,
    commentId: string,
  ): Promise<Comment | undefined> {
    return this.commentModel.findOne({ userUrn, commentId }).exec();
  }
}
