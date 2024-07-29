import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserLink, UserLinkDocument } from '../../schemas/user-link.schema';
import { CreateUserLinkDto, UpdateUserLinkDto } from '../../dtos/user-link.dto';
import { generate } from '../../utils/generate.util';

@Injectable()
export class UserLinkService {
  constructor(
    @InjectModel(UserLink.name) private userLinkModel: Model<UserLinkDocument>,
  ) {}

  async createUserLink(
    userUrn: string,
    createUserLinkDto: CreateUserLinkDto,
  ): Promise<UserLink> {
    const { link, linkType, linkName } = createUserLinkDto;
    const isExist = await this.findOneByUrn(userUrn);
    let linkNum = 0;
    if (isExist) {
      linkNum = isExist.linkNum + 1;
    } else {
      linkNum = 1;
    }

    if (userUrn) {
      const userLink = new this.userLinkModel({
        clickId: generate(8),
        userUrn,
        link,
        linkNum,
        linkType,
        linkName,
      });
      return userLink.save();
    } else {
      throw new BadRequestException(
        'Required information has not been inserted.',
      );
    }
  }

  async updateUserLink(
    userUrn: string,
    updateUserLinkDto: UpdateUserLinkDto,
  ): Promise<UserLink> {
    const { link, linkNum, linkType, linkName } = updateUserLinkDto;
    const userLink = await this.findOneByUrnLink(userUrn, Number(linkNum));

    const data = {};
    if (link) data['link'] = link;
    if (linkType) data['linkType'] = linkType;
    if (linkName) data['linkName'] = linkName;

    return userLink.updateOne(data);
  }

  async clickLink(
    userUrn: string,
    clickId: string,
  ): Promise<UserLink | undefined> {
    const userLink = await this.findOneByUrnClick(userUrn, clickId);

    if (userLink) {
      return userLink.updateOne({ $inc: { linkCnt: 1 } });
    } else {
      throw new BadRequestException('The user does not exist.');
    }
  }

  async findOneByUrn(userUrn: string): Promise<UserLink | undefined> {
    return this.userLinkModel.findOne({ userUrn }).sort('-linkNum').exec();
  }

  async findOneByUrnLink(
    userUrn: string,
    linkNum: number,
  ): Promise<UserLink | undefined> {
    return this.userLinkModel.findOne({ userUrn, linkNum }).exec();
  }

  async findOneByUrnClick(
    userUrn: string,
    clickId: string,
  ): Promise<UserLink | undefined> {
    return this.userLinkModel.findOne({ userUrn, clickId }).exec();
  }
}
